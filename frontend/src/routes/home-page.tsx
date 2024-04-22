import { Button } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { SimplifiedPlaylist } from "spotify-types";
import { ModeSelector, PlaylistTable } from "../components";
import { WEB_SPOTIFY_URL } from "../lib/consts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './home-page.scss';
import { getUserPlaylists } from "../lib/spotify-api";
import MediaQuery from "react-responsive";

export async function playlistLoader() {
  console.log('Loading home page...');
  return await getUserPlaylists();
}

export function HomePage() {
  const playlists = useLoaderData() as Awaited<ReturnType<typeof playlistLoader>>;
  const [chosenPlaylist, setChosenPlaylist] = useState<SimplifiedPlaylist>();

  const unsetPlaylist = () => setChosenPlaylist(undefined);

  if (!playlists.length) {
    return <div className="no-playlist">
      <h2>No playlists</h2>
      <p>You have no <strong>public</strong> playlist on Spotify.</p>
      <p>Go to <a href={WEB_SPOTIFY_URL}>Spotify</a>, add some playlist to your profile and come back here !</p>
    </div>
  }

  else if (!chosenPlaylist) {
    return <>
      <PlaylistTable playlists={playlists} callback={setChosenPlaylist} />
    </>
  }

  return <div className='mode-selector'>
    <MediaQuery minWidth={800}>
      <Button
        color="inherit"
        aria-label="unselect playlist"
        className="back-btn"
        onClick={unsetPlaylist}>
        <ArrowBackIcon className="back-icon" />
      </Button>
    </MediaQuery>
    <ModeSelector selectedPlaylist={chosenPlaylist} />
  </div>;
}
