// Define the root server route
const ROOT_SERVER_ROUTE = "http://localhost:8747";

// Define the root auth route
const AUTH_ROUTE_ROOT = `${ROOT_SERVER_ROUTE}/api/auth`;

// Export the API routes object
export const API_ROUTES = {
  ROOT_SERVER_ROUTE,
  AUTH_ROUTE_ROOT,
  SIGN_UP: `${AUTH_ROUTE_ROOT}/sign-up`,
  LOG_IN: `${AUTH_ROUTE_ROOT}/log-in`,
  GET_PROFILE: `${AUTH_ROUTE_ROOT}/profile`,
  UPDATE_PROFILE: `${AUTH_ROUTE_ROOT}/update-profile`,
};
