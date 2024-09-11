import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { fileUpload } from "../middlewares/multer.js";
import {
  getAllUsers, addContact, getContacts, deleteContact,
  fetchUserChatMessages, fetchGroupChatMessages,
  getGroups, fetchGroupInfo,
  fetchUnknownContacts, fetchBlockedContacts,
  handleFileMessage,
  addUnknownUserToContacts,
  blockUser, unblockUser
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

// Fetch details info for a specific group
routes.get("/group/:groupId", verifyToken, fetchGroupInfo);

// Fetch all groups the user is a part of
routes.get("/groups", verifyToken, getGroups);

routes.put(
  "/fileMessage",
  verifyToken,
  fileUpload.single("file"),
  handleFileMessage
);



// ---------------------------------------------------------------
// Advanced Functionalities
// ---------------------------------------------------------------

// Fetch all unknown messages (messages from users not in contacts)
routes.get("/unknown-messages", verifyToken, fetchUnknownContacts);

// Add an unknown user to contact, from which you have received a message
routes.post("/add-unknown-to-contacts/:userId", verifyToken, addUnknownUserToContacts);

// Fetch all blocked contacts
routes.get("/blocked-contacts", verifyToken, fetchBlockedContacts);

// block a user
routes.post("/block-user/:userId", verifyToken, blockUser);

// unblock a user
routes.post("/unblock-user/:userId", verifyToken, unblockUser);

export default routes;
