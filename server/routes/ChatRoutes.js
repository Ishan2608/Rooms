import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAllUsers, addContact, getContacts,
  fetchUserChatMessages, fetchGroupChatMessages,
  sendMessage,
  createGroup, getGroups, fetchGroupInfo, updateGroupInfo, leaveGroup, deleteGroup
} from "../controllers/ChatController.js";


const routes = Router();

// Fetch list of all users in the application (for search and add to contacts)
routes.get("/users", verifyToken, getAllUsers);

// Add a contact to the user's contact list
routes.post("/contact", verifyToken, addContact);

// Fetch all contacts for the current user
routes.get("/contacts", verifyToken, getContacts);

// Fetch messages for a specific user-user chat
routes.get("/messages/user/:userId", verifyToken, fetchUserChatMessages);

// Fetch messages for a specific group chat
routes.get("/messages/group/:groupId", verifyToken, fetchGroupChatMessages);

// Send a message (text or file) to a contact or group
routes.post("/message", verifyToken, fileUpload.single("file"), sendMessage);

// Create a new group
routes.post("/group", verifyToken, createGroup);

// Update group info (name, description, or add/remove members)
routes.put("/group/:groupId", verifyToken, updateGroupInfo);

// Fetch details info for a specific group
routes.get("/group/:groupId", verifyToken, fetchGroupInfo);

// Fetch all groups the user is a part of
routes.get("/groups", verifyToken, getGroups);

// Delete a group
routes.delete("/group/:groupId", verifyToken, deleteGroup);

// Leave a group (for a non-admin user)
routes.post("/group/:groupId/leave", verifyToken, leaveGroup);

export default routes;
