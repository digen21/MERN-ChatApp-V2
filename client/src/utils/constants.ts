export const HOST = import.meta.env.VITE_API_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const USER_ROUTES = "api/users";
export const CONTACTS_ROUTES = "api/contacts";
export const MESSAGES_ROUTES = "api/messages";
export const CHANNEL_ROUTES = "api/channels";

export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signUp`;
export const SIGNIN_ROUTES = `${AUTH_ROUTES}/signIn`;
export const LOGOUT_ROUTES = `${AUTH_ROUTES}/logout`;
export const GET_USER_INFO = `${AUTH_ROUTES}/profile`;
export const UPDATE_USER_INFO = USER_ROUTES;
export const UPDATE_PROFILE_IMAGE = `${USER_ROUTES}/profile-image`;
export const GET_CONTACTS = `${CONTACTS_ROUTES}/`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;
export const GET_MESSAGES = `${MESSAGES_ROUTES}/`;
export const GET_FILE = `${MESSAGES_ROUTES}/get-file`;
export const GET_USER_CONTACTS = `${CONTACTS_ROUTES}/user-contacts`;
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-file`;
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}`;
export const GET_CHANNELS = `${CHANNEL_ROUTES}`;
export const GET_CHANNELS_MESSAGES = `${CHANNEL_ROUTES}/channel-messages`;

export const UPLOAD_FILE_FORMAT =
  ".png, .jpg, .jpeg, .svg, .webp, .mp4, .heci, .mov";

export const UPLOAD_IMAGE_FORMAT = ".png, .jpg, .jpeg, .svg, .webp, .heci,";
