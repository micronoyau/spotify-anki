import 'dotenv/config';

export const FRONT_URL = process.env.FRONT_URL ?? '';
export const BACK_URL = process.env.BACK_URL ?? '';
export const HOME_URL = FRONT_URL + 'home';
export const REDIRECT_URI = BACK_URL + 'callback'; // Your redirect uri

export const STATEKEY = 'spotify_auth_state';
export const USER_COOKIE = 'user_token';

export const DB_HOST = process.env.DB_HOST ?? '';
export const DB_PORT = Number(process.env.DB_PORT) || 0;
export const DB_USER = 'root';
export const DB_PASSWORD = process.env.MYSQL_ROOT_PASSWORD ?? '';

export const CLIENT_ID = process.env.CLIENT_ID || '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET || '';

export const UPDATE_OK = { update: "ok" };

export const UPLOADS_DIR = "./uploads/";
export const ALLOWED_MIME = ["audio/mpeg", "audio/wav", "audio/webm"];
