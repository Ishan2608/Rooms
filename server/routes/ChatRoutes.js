import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { groupImageUpload } from "../middlewares/multer.js";
import {
  getAllUsers, addContact, getContacts, deleteContact,
  fetchUserChatMessages, fetchGroupChatMessages,
  getGroups, fetchGroupInfo, updateGroupInfo,
  fetchUnknownMessages, addUnknownUserToContacts, blockUser, unblockUser, fetchBlockedContacts
} from "../controllers/ChatController.js";


const routes = Router();

// Fetch list of all users in the application (for search and add to contacts)
routes.get("/users", verifyToken, getAllUsers);

// Add a contact to the user's contact list
routes.post("/contact", verifyToken, addContact);

// Fetch all contacts for the current user
routes.get("/contacts", verifyToken, getContacts);

// delete a contact
routes.delete("/contacts/:contactId", verifyToken, deleteContact);

// Fetch messages for a specific user-user chat
routes.get("/messages/user/:userId", verifyToken, fetchUserChatMessages);

// Fetch messages for a specific group chat
routes.get("/messages/group/:groupId", verifyToken, fetchGroupChatMessages);

// Update group info (name, description, or add/remove members)
routes.put("/group/:groupId", verifyToken, groupImageUpload.single('image'), updateGroupInfo);

// Fetch details info for a specific group
routes.get("/group/:groupId", verifyToken, fetchGroupInfo);

// Fetch all groups the user is a part of
routes.get("/groups", verifyToken, getGroups);

// ---------------------------------------------------------------
// Advanced Functionalities
// ---------------------------------------------------------------

// Fetch all unknown messages (messages from users not in contacts)
routes.get("/unknown-messages", verifyToken, fetchUnknownMessages);

// Add a user from the unknown messages list to the contact list
routes.post("/unknown-messages/add-contact/:userId", verifyToken, addUnknownUserToContacts);

// Fetch all blocked contacts
routes.get("/blocked-contacts", verifyToken, fetchBlockedContacts);

// Block a user (also removes them from contacts if they are there)
routes.post("/block/:userId", verifyToken, blockUser);

// Unblock a user (optionally re-add them to contacts)
routes.post("/unblock/:userId", verifyToken, unblockUser);

export default routes;
