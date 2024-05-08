import { BACK_URL, ERROR_UNEXPECTED_BACKEND_ERROR } from "./consts";

async function requestAPI(url: string, options: RequestInit | undefined = undefined) {
  const response = await fetch(BACK_URL + url, options);
  if (response.status !== 200 && response.status !== 401) throw new Error(ERROR_UNEXPECTED_BACKEND_ERROR);
  switch (response.headers.get('Content-Type')) {
    case 'application/json; charset=utf-8':
      return await response.json();
    case 'text/html; charset=utf-8':
      return await response.text();
    default:
      return;
  }
}

/**
 * Fetches songs to study and all previously encountered songs in database
 */
export async function getStudySongs(user_id: string, playlist_id: string, rep_interval: number): Promise<{ toStudy: string[], studied: string[] }> {
  return requestAPI(`get_study_songs/${user_id}/${playlist_id}/${rep_interval}`);
}

/**
 * Request backend to update song score
 */
export async function updateStudySong(user_id: string, playlist_id: string, song_id: string, quality: number) {
  return requestAPI(`update_study_song/${user_id}/${playlist_id}/${song_id}/${quality}`);
}

/**
 * Request backend to delete progression
 */
export async function getUserProgression(user_id: string, playlist_id: string) {
  return requestAPI(`progression/${user_id}/${playlist_id}/5`);
}

/**
 * Request backend to delete progression
 */
export async function resetProgression(user_id: string, playlist_id: string) {
  return requestAPI(`reset_progression/${user_id}/${playlist_id}`);
}

/**
 * Request user local login
 */
export function userLogin() {
  return requestAPI("locallogin?userLogin=true");
}

/**
 * Submit a request of playlist review
 */
export async function submitRequest(id: string) {
  return requestAPI('reqstore?playlist_id=' + id)
}

/**
 * Refresh spotify token
 */
export function refreshSpotifyToken(refresh_token: string) {
  return requestAPI('refresh_token?refresh_token=' + refresh_token);
}

