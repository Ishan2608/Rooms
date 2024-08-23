// Define the root server route
export const HOST = "http://localhost:8747";

// Define the root auth route
export const AUTH_ROOT = `${HOST}/api/auth`;

// root route for chats
export const CHAT_ROOT = `${HOST}/api/chats`;

// Export the API routes object for auth
export const API_ROUTES = {
  SIGN_UP: `${AUTH_ROOT}/sign-up`,
  LOG_IN: `${AUTH_ROOT}/log-in`,
  GET_PROFILE: `${AUTH_ROOT}/profile`,
  UPDATE_PROFILE: `${AUTH_ROOT}/update-profile`,
};

// Export API routes object for chats
export const CHAT_ROUTES = {
  GET_ALL_USERS: `${CHAT_ROOT}/users`,
  ADD_TO_CONTACT: `${CHAT_ROOT}/contact`,
  GET_ALL_CONTACTS: `${CHAT_ROOT}/contacts`,
  FETCH_USER_CHAT_MESSAGES: `${CHAT_ROOT}/messages/user/:userId`,
  FETCH_GROUP_CHAT_MESSAGES: `${CHAT_ROOT}/messages/group/:groupId`,
  SEND_MESSAGE: `${CHAT_ROOT}/message`,
  CREATE_NEW_GROUP: `${CHAT_ROOT}/group`,
  UPDATE_GROUP_INFO: `${CHAT_ROOT}/group/:groupId`,
  FETCH_GROUP_INFO: `${CHAT_ROOT}/group/:groupId`,
  GET_ALL_GROUPS: `${CHAT_ROOT}/groups`,
  DELETE_GROUP: `${CHAT_ROOT}/group/:groupId`,
  LEAVE_GROUP: `${CHAT_ROOT}/group/:groupId/leave`,
};
