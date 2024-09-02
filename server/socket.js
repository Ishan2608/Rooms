import { Server as SocketIOServer } from "socket.io";
import Chat from "./models/ChatModel.js";
import Group from "./models/GroupModel.js";

export const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userMap = new Map();

  const disconnect = (socket) => {
    for (const [userId, socketId] of userMap.entries()) {
      if (socketId === socket.id) {
        userMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocket = userMap.get(message.sender);
    const recipientSocket = userMap.get(message.recipient);

    const createdMessage = await Chat.create(message);
    const messageData = await Chat.findById(createdMessage._id)
      .populate("sender", "id username image")
      .populate("recipient", "id username image");

    if (recipientSocket) {
      io.to(recipientSocket).emit("receiveMessage", messageData);
    }
    // Optionally, you can skip this to prevent the message from being sent back to the sender
    if (senderSocket && senderSocket !== recipientSocket) {
      io.to(senderSocket).emit("receiveMessage", messageData);
    }
  };

  const createGroup = async (groupData) => {
    const group = await Group.create(groupData);
    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "id email firstName lastName username image")
      .populate("members", "id email firstName lastName username image");

    // Notify all group members about the new group
    groupData.members.forEach((memberId) => {
      const memberSocket = userMap.get(memberId.toString());
      if (memberSocket) {
        io.to(memberSocket).emit("groupCreated", populatedGroup);
      }
    });
  };

  const updateGroupInfo = async (data) => {
    try {
      const { id, name, description, imageFile } = data;
      const group = await Group.findById(id).populate("members");

      if (!group) {
        return;
      }

      // Update group details
      if (name) group.name = name;
      if (description) group.description = description;

      // Add new members
      if (addMembers && Array.isArray(addMembers)) {
        group.members = [...new Set([...group.members, ...addMembers])]; // Add members without duplicates
      }

      // Remove members
      if (removeMembers && Array.isArray(removeMembers)) {
        group.members = group.members.filter(
          (memberId) => !removeMembers.includes(memberId.toString())
        );
      }

      // Save updated group
      await group.save();

      // Notify all members about the updated group info
      group.members.forEach((member) => {
        const memberSocket = userMap.get(member._id.toString());
        if (memberSocket) {
          io.to(memberSocket).emit("groupInfoUpdated", group);
        }
      });
    } catch (error) {
      console.error("Error handling updateGroupInfo event:", error);
    }
  };

  const leaveGroup = async ({groupId, userId}) => {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        console.error("Group not found");
        return;
      }

      // Remove the user from the group's members list
      group.members = group.members.filter(
        (member) => member.toString() !== userId.toString()
      );

      // Save the updated group
      await group.save();

      // Notify other members that a user has left the group
      group.members.forEach((member) => {
        const memberSocket = userMap.get(member._id.toString());
        if (memberSocket) {
          io.to(memberSocket).emit("groupMemberLeft", {
            groupId,
            userId,
          });
        }
      });

      // Notify the user that they have left the group
      const userSocket = userMap.get(userId.toString());
      if (userSocket) {
        io.to(userSocket).emit("leftGroup", groupId);
      }
    } catch (error) {
      console.error("Error handling leaveGroup event:", error);
    }
  }

  const deleteGroup = async (groupId) => {
    try {
      const group = await Group.findById(groupId).populate("members");

      if (!group) {
        return;
      }

      // Emit an event to all group members to notify them of the deletion
      group.members.forEach((member) => {
        const memberSocket = userMap.get(member._id.toString());
        if (memberSocket) {
          io.to(memberSocket).emit("groupDeleted", groupId);
        }
      });

      // Delete the group from the database
      await Group.findByIdAndDelete(groupId);
    } catch (error) {
      console.error("Error handling deleteGroup event:", error);
    }
  };

  const sendGroupMessage = async (message) => {
    const group = await Group.findById(message.group).populate("members");

    if (!group) {
      return;
    }

    const createdMessage = await Chat.create(message);
    const messageData = await Chat.findById(createdMessage._id)
      .populate("sender", "id username image")
      .populate("group", "id name");
    // Notify all members in the group
    group.members.forEach((member) => {
      const memberSocket = userMap.get(member._id.toString());
      if (memberSocket) {
        io.to(memberSocket).emit("receiveGroupMessage", messageData);
      }
    });
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userMap.set(userId, socket.id);
    } else {
      console.log("User ID not provided");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("sendGroupMessage", sendGroupMessage);
    socket.on("createGroup", createGroup);
    socket.on("updateGroupInfo", updateGroupInfo);
    socket.on("leaveGroup", leaveGroup)
    socket.on("deleteGroup", deleteGroup);
    socket.on("disconnect", () => disconnect(socket));
  });
};
