import { Server as SocketIOServer } from "socket.io";
import Chat from "./models/ChatModel.js";
import Group from "./models/GroupModel.js";
import User from "./models/UserModel.js";
import fs from "fs";

var io;
const userMap = new Map();

export const setupSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const sendMessage = async (message) => {
    try {
      const senderSocket = userMap.get(message.sender);
      const recipientSocket = userMap.get(message.recipient);

      // Find the recipient user
      const recipientUser = await User.findById(message.recipient);
      if (!recipientUser) {
        console.error("Recipient user not found");
        return;
      }

      const isSenderBlocked = recipientUser.blockedContacts.includes(message.sender);
      if (isSenderBlocked) {
        console.log("Message not sent: sender is blocked by the recipient.");
        // Exit if the sender is blocked
        return; 
      }

      // Create and populate the message
      const createdMessage = await Chat.create(message);
      const messageData = await Chat.findById(createdMessage._id)
        .populate("sender", "id username image")
        .populate("recipient", "id username image");

      // Check if the sender is in the recipient's contacts list
      const isSenderInContacts = recipientUser.contacts.includes(
        message.sender
      );

      if (!isSenderInContacts) {

        // If sender is not in contacts, add to unknownContacts
        if (!recipientUser.unknownContacts.includes(message.sender)) {
          recipientUser.unknownContacts.push(message.sender);
          await recipientUser.save();
        }

        // Emit to recipient about the unknown sender
        if (recipientSocket) {
          io.to(recipientSocket).emit("receiveUnknownMessage", messageData);
        }

      } else {
        // Emit the message to the recipient if sender is known
        if (recipientSocket) {
          io.to(recipientSocket).emit("receiveMessage", messageData);
        }
      }

      // Optionally, you can skip this to prevent the message from being sent back to the sender
      if (senderSocket && senderSocket !== recipientSocket) {
        io.to(senderSocket).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createGroup = async (groupData) => {
    try {
      // Create the new group in the database
      const group = await Group.create(groupData);

      // Populate the necessary fields (admin and members)
      const populatedGroup = await Group.findById(group._id)
        .populate("admin", "id username image")
        .populate("members", "id username image");

      console.log("Backend: Group Created");

      // Notify all group members about the new group
      populatedGroup.members.forEach((member) => {
        const memberSocket = userMap.get(member._id.toString());
        if (memberSocket) {
          io.to(memberSocket).emit("groupCreated", populatedGroup);
        }
      });
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const leaveGroup = async ({ groupId, userId }) => {
    try {
      const group = await Group.findById(groupId).populate(
        "members",
        "id username image"
      );

      if (!group) {
        console.error("Group not found");
        return;
      }

      // Check if the user leaving is the admin
      const isAdmin = group.admin.toString() === userId.toString();

      // Remove the user from the group's members list
      group.members = group.members.filter(
        (member) => member._id.toString() !== userId.toString()
      );

      // If the group becomes empty after the user leaves, delete the group
      if (group.members.length === 0) {
        // Notify the user that the group has been deleted
        const userSocket = userMap.get(userId);
        if (userSocket) {
          io.to(userSocket).emit("groupDeleted", groupId);
        }

        // Delete the group from the database
        await Group.findByIdAndDelete(groupId);

        console.log("Group deleted as it became empty.");
        return;
      }

      // If the user is the admin, assign a new admin from the remaining members
      if (isAdmin && group.members.length > 0) {
        const randomIndex = Math.floor(Math.random() * group.members.length);
        const newAdmin = group.members[randomIndex];
        group.admin = newAdmin._id;
      }

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
      const userSocket = userMap.get(userId);
      if (userSocket) {
        io.to(userSocket).emit("leftGroup", groupId);
      }
    } catch (error) {
      console.error("Error handling leaveGroup event:", error);
    }
  };


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

  const disconnect = (socket) => {
    for (const [userId, socketId] of userMap.entries()) {
      if (socketId === socket.id) {
        userMap.delete(userId);
        break;
      }
    }
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
    socket.on("leaveGroup", leaveGroup)
    socket.on("deleteGroup", deleteGroup);
    socket.on("disconnect", () => disconnect(socket));
  });

  return io;

};

export const getSocketInstance = () => io;

// **Export function to get user's socket ID**
export const getUserSocket = (userId) => {
  return userMap.get(userId);
};

// **Export io and userMap for potential future use**
export { io, userMap };