import { useLoaderData } from 'react-router-dom';
import { ERROR_EMPTY_PLAYLIST } from '../../lib/consts';
import { useCallback, useEffect, useState } from 'react';
import { getPlaylistItems, getUserData } from '../../lib/spotify-api';
import { randomChoice } from '../../lib/random';
import { Player } from '../../components';
import { getStudySongs, updateStudySong } from '../../lib/backend-api';
import { Track } from 'spotify-types';
import { FlashCard } from '../../components/flashcard/FlashCard';
import './study-page.scss';

const REFRESH_DELAY = 10000; // Refresh period for toStudy songs in ms

async function getStudyTracks(userId: string, playlistId: string, tracks: Track[], rep_interval: number) {
  const { toStudy: toStudy_, studied } = (await getStudySongs(userId, playlistId, rep_interval));
  const toStudy = tracks.filter(t => t.preview_url && toStudy_.includes(t.id));
  const newTracks = tracks.filter(t => t.preview_url && !studied.includes(t.id));
  return { toStudy, newTracks };
}

export async function studyLoader({ params: { playlist_id, rep_interval } }: any) {
  console.log(`Loading study mode with playlist_id = ${playlist_id} and rep_interval = ${rep_interval}`);

  const playlistId = (playlist_id || "") as string;
  const userId = (await getUserData()).id;

  const tracks = await getPlaylistItems(playlist_id);
  if (!tracks)
    throw new Error(ERROR_EMPTY_PLAYLIST);

  const { toStudy, newTracks } = await getStudyTracks(userId, playlistId, tracks, rep_interval);

  return { userId, playlistId, tracks, toStudy, newTracks, rep_interval };
}

export function StudyPage() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof studyLoader>>;
  const [newTracks, setNewTracks] = useState(loaderData.newTracks);
  const [toStudy, setToStudy] = useState(loaderData.toStudy);
  const [selectedTrack, setSelectedTrack] = useState<Track>();
  const [flipped, setFlipped] = useState(false);
  const [playingStarted, setPlayingStarted] = useState(false);

  /**
   * Select a random track by taking care of removing
   * the currently selected song from the loaded songs
   */
  const getRandomTrack = () => {
    let updatedToStudy = toStudy;
    let updatedNewTracks = newTracks;

    if (selectedTrack) {
      updatedToStudy = toStudy.filter(t => t.id !== selectedTrack.id);
      updatedNewTracks = newTracks.filter(t => t.id !== selectedTrack.id);
      setToStudy(updatedToStudy);
      setNewTracks(updatedNewTracks);
    }

    if (!updatedToStudy.length && !updatedNewTracks.length) {
      return;
    }

    return updatedToStudy.length ? randomChoice(updatedToStudy) : randomChoice(updatedNewTracks);
  }

  // Regularly refresh songs to study
  useEffect(() => {
    const interval = setInterval(async () => {
      const { toStudy: updatedToStudy, newTracks: updatedNewTracks } = await getStudyTracks(
        loaderData.userId,
        loaderData.playlistId,
        loaderData.tracks,
        loaderData.rep_interval
      );
      setToStudy(updatedToStudy);
      setNewTracks(updatedNewTracks);
    }, REFRESH_DELAY);

    return () => clearInterval(interval);
  }, [toStudy])

  // Ensure that the flashcard can be flipped iff the music is started
  const flashcardClicked = useCallback(() => {
    playingStarted && setFlipped(true);
  }, [playingStarted]);

  if (!selectedTrack) {
    // Ensure that a new track gets selected if there is a song to select
    if (newTracks.length || toStudy.length)
      setSelectedTrack(getRandomTrack());
    return (<div className="study-page">
      <p className="study-over">You already studied everything in this playlist !</p>
    </div>);
  }

  /**
   * Click handler for difficulty levels
   */
  const submitLevel = (quality: number) => {
    updateStudySong(loaderData.userId, loaderData.playlistId, selectedTrack.id, quality);
    setSelectedTrack(getRandomTrack());
    setFlipped(false);
  }

  const playerClicked = (playing: boolean) => {
    setPlayingStarted(playing || playingStarted);
  };

  return (
    <div className="study-page">
      <Player callback={playerClicked} preview_url={selectedTrack.preview_url} />
      <FlashCard callback={submitLevel} onClick={flashcardClicked} description={selectedTrack.artists.map(a => a.name).join(',') + ' - ' + selectedTrack.name} flipped={flipped} />
    </div>
  );
}
