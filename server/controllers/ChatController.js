import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js"
import Group from "../models/GroupModel.js";
import { getSocketInstance, getUserSocket } from "../socket.js";

const io = getSocketInstance();

// Fetch list of all users in the application (for search and add to contacts)
export const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users except the currently logged-in user
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "firstName lastName username image"
    );

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

// Add a contact to the user's contact list
export const addContact = async (req, res) => {
  const { contactId } = req.body;
  try {
    // Ensure the contactId is provided
    if (!contactId) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    // Find the current user
    const currentUser = await User.findById(req.userId);

    // Check if the contact is already in the user's contact list
    if (currentUser.contacts.includes(contactId)) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    // Add the contactId to the user's contact list
    currentUser.contacts.push(contactId);
    await currentUser.save();

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.error("Error adding contact:", error);
    res.status(500).json({ message: "Failed to add contact" });
  }
};

// Fetch all contacts for the current user
export const getContacts = async (req, res) => {
  try {
    // Find the current user and populate the contacts field
    const user = await User.findById(req.userId).populate(
      "contacts",
      "firstName lastName username image"
    );

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's contacts
    res.status(200).json(user.contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

// Function to delete a contact
export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.userId;

    // Find the user and remove the contact from their contact list
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove contact from the user's contact list
    user.contacts = user.contacts.filter(contact => contact.toString() !== contactId);
    await user.save();

    // Find the contact user and remove the user from their contact list
    const contactUser = await User.findById(contactId);
    if (contactUser) {
      contactUser.contacts = contactUser.contacts.filter(contact => contact.toString() !== userId);
      await contactUser.save();
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch messages for a specific user-user chat
export const fetchUserChatMessages = async (req, res) => {
  try {
    const loggedInUserId = req.userId; // The currently authenticated user
    const otherUserId = req.params.userId; // The userId of the other user in the chat

    // Validate if the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch messages where the logged-in user is either the sender or recipient,
    // and the other user is the corresponding recipient or sender
    const messages = await Chat.find({
      $or: [
        { sender: loggedInUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: loggedInUserId },
      ],
    })
      .sort({ createdAt: 1 }) // Sort messages by creation time in ascending order
      .populate("sender", "id username firstName lastName") // Optionally populate sender info
      .populate("recipient", "id username firstName lastName"); // Optionally populate recipient info

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching user chat messages:", err);
    res.status(500).json({ message: "Failed to fetch chat messages." });
  }
};

// Fetch messages for a specific group chat
export const fetchGroupChatMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId; // The groupId of the group chat

    // Validate if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Fetch messages that belong to the specific group
    const messages = await Chat.find({ group: groupId })
      .sort({ createdAt: 1 }) // Sort messages by creation time in ascending order
      .populate("sender", "username firstName lastName"); // Optionally populate sender info

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching group chat messages:", err);
    res.status(500).json({ message: "Failed to fetch group chat messages." });
  }
};


export const getGroups = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all groups where the user is a member
    const groups = await Group.find({ members: userId }).populate("admin", "username").populate("members", "username");

    if (!groups.length) {
      return res.status(404).json({ message: "No groups found" });
    }

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const fetchGroupInfo = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Find the group by ID
    const group = await Group.findById(groupId)
      .populate("admin", "username")
      .populate("members", "username");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handleFileMessage = async (req, res) => {
  try {
    const { recipient, group} = req.body;
    const sender = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/chat_files/${req.file.filename}`;

    const messageData = {
      sender,
      file: fileUrl,
      ...(recipient && { recipient }),
      ...(group && { group }),
    };

    const createdMessage = await Chat.create(messageData);

    const populatedMessage = await Chat.findById(createdMessage._id)
      .populate("sender", "id username image")
      .populate("recipient", "id username image")
      .populate("group", "id name");

    if (recipient) {
      const recipientSocket = getUserSocket(recipient);

      if (recipientSocket) {
        io.to(recipientSocket).emit("receiveMessage", populatedMessage);
      }
    } else if (group) {
      const groupMembers = await Group.findById(group).populate("members");

      groupMembers.members.forEach((member) => {
        const memberSocket = getUserSocket(member._id.toString());
        if (memberSocket) {
          io.to(memberSocket).emit("receiveGroupMessage", populatedMessage);
        }
      });
    }

    return res.status(200).json(populatedMessage);
  } catch (error) {
    console.error("Error handling file message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Advanced Functionalities

export const fetchUnknownMessages = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID and populate the unknownMessages field
    const user = await User.findById(userId)
      .populate({
        path: "unknownContacts.user",
        select: "id username image",
      })
      .populate({
        path: "unknownContacts.messages",
        select: "id sender recipient content file createdAt",
      });

    if (!user || !user.unknownContacts.length) {
      return res.status(404).json({ message: "No unknown messages found" });
    }

    res.status(200).json(user.unknownContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addUnknownUserToContacts = async (req, res) => {
  try {
    const userId = req.userId;
    const unknownUserId = req.params.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the unknown user is already in contacts
    if (user.contacts.includes(unknownUserId)) {
      return res.status(400).json({ message: "User is already in contacts" });
    }

    // Add the unknown user to contacts
    user.contacts.push(unknownUserId);

    // Remove from unknownMessages
    user.unknownMessages = user.unknownMessages.filter(
      (message) => message.user.toString() !== unknownUserId
    );

    await user.save();

    res.status(200).json({ message: "User added to contacts" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchBlockedContacts = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID and populate the blockedContacts field
    const user = await User.findById(userId).populate(
      "blockedContacts",
      "firstName lastName username image"
    ); // Populate with required fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the list of blocked contacts
    return res.status(200).json(user.blockedContacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching blocked contacts" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.userId;
    const blockUserId = req.params.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user to the blockedContacts list
    if (!user.blockedContacts.includes(blockUserId)) {
      user.blockedContacts.push(blockUserId);
    }

    // Remove the user from contacts if they are in there
    user.contacts = user.contacts.filter(
      (contact) => contact.toString() !== blockUserId
    );

    // Remove any unknown messages from this user
    user.unknownMessages = user.unknownMessages.filter(
      (message) => message.user.toString() !== blockUserId
    );

    await user.save();

    res.status(200).json({ message: "User blocked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.userId;
    const unblockUserId = req.params.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the blockedContacts list
    user.blockedContacts = user.blockedContacts.filter(
      (blockedUser) => blockedUser.toString() !== unblockUserId
    );

    await user.save();

    res.status(200).json({ message: "User unblocked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

