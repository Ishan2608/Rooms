// Define the root server route
export const HOST = "http://localhost:8747";

// Define the root auth route
export const AUTH_ROOT = `${HOST}/api/auth`;

// Export the API routes object for auth
export const API_ROUTES = {
  SIGN_UP: `${AUTH_ROOT}/sign-up`,
  LOG_IN: `${AUTH_ROOT}/log-in`,
  GET_PROFILE: `${AUTH_ROOT}/profile`,
  UPDATE_PROFILE: `${AUTH_ROOT}/update-profile`,
};

// root route for chats
export const CHAT_ROOT = `${HOST}/api/chats`;

// Export API routes object for chats
export const CHAT_ROUTES = {
  GET_ALL_USERS: `${CHAT_ROOT}/users`,
  ADD_TO_CONTACT: `${CHAT_ROOT}/contact`,
  GET_ALL_CONTACTS: `${CHAT_ROOT}/contacts`,
  DELETE_A_CONTACT: `${CHAT_ROOT}/contacts`,

  GET_ALL_GROUPS: `${CHAT_ROOT}/groups`,
  FETCH_GROUP_INFO: `${CHAT_ROOT}/group/:groupId`,
  UPLOAD_GROUP_IMAGE: `${CHAT_ROOT}/upload-image`,

  FETCH_USER_CHAT_MESSAGES: `${CHAT_ROOT}/messages/user`,
  FETCH_GROUP_CHAT_MESSAGES: `${CHAT_ROOT}/messages/group`,

  ADD_UNKNOWN_TO_CONTACTS: `${CHAT_ROOT}/add-unknown-to-contacts`,
  BLOCK_USER: `${CHAT_ROOT}/block-user`,
  UNBLOCK_USER: `${CHAT_ROOT}/unblock-user`,
  FETCH_UNKNOWN_CONTACTS: `${CHAT_ROOT}/unknown-messages`,
  FETCH_BLOCKED_CONTACTS: `${CHAT_ROOT}/blocked-contacts`,
  SEND_FILE_MESSAGE: `${CHAT_ROOT}/fileMessage`,
};
