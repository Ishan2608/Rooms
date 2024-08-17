// Define the root server route
export const HOST = "http://localhost:8747";

// Define the root auth route
export const AUTH_ROOT = `${HOST}/api/auth`;

// Export the API routes object
export const API_ROUTES = {
  SIGN_UP: `${AUTH_ROOT}/sign-up`,
  LOG_IN: `${AUTH_ROOT}/log-in`,
  GET_PROFILE: `${AUTH_ROOT}/profile`,
  UPDATE_PROFILE: `${AUTH_ROOT}/update-profile`,
};
