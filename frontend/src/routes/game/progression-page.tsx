import { Button, Slider } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getUserProgression, resetProgression } from "../../lib/backend-api";
import { getPlaylistItems, getUserData } from "../../lib/spotify-api";
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './progression-page.scss';
import { PROGRESSION_URL, STUDY_URL } from "../../lib/consts";
import { useState } from "react";

const DEFAULT_INTERVAL = 5;

export async function progressionLoader({ params: { playlist_id } }: any) {
  const userId = (await getUserData()).id;
  console.log('Loading progression for user ID = ', userId);
  const { registeredSongs, lastUpdate, averageEf, toStudy } = (await getUserProgression(userId, playlist_id));
  const playlistSize = (await getPlaylistItems(playlist_id)).length;
  return { userId, playlist_id, registeredSongs, lastUpdate, toStudy, playlistSize };
}

export function ProgressionPage() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof progressionLoader>>;
  const navigate = useNavigate();
  const [repInterval, setRepInterval] = useState(DEFAULT_INTERVAL);

  const onDelete = () => {
    resetProgression(loaderData.userId, loaderData.playlist_id);
    navigate(PROGRESSION_URL(loaderData.playlist_id));
  };

  return (<div className="progression-page">
    <h1>Progression :</h1>
    <div className="progression-container">
      {loaderData.registeredSongs ?
        <PieChart
          color="inherit"
          slotProps={{
            legend: { hidden: true },
          }}
          series={[
            {
              cx: 146, // Should be 150, but a fea pixels off
              arcLabel: (item) => `${item.label} (${item.value})`,
              arcLabelMinAngle: 30,
              data: [
                {
                  id: 0,
                  value: loaderData.toStudy,
                  label: "To study"
                },
                {
                  id: 1,
                  value: loaderData.registeredSongs - loaderData.toStudy,
                  label: "Remembered"
                },
                {
                  id: 2,
                  value: loaderData.playlistSize - loaderData.registeredSongs,
                  label: "Unkown"
                },
              ]
            }
          ]}
          width={300}
          height={200}
        />
        : <h2>New study</h2>}
      <p>Studied songs : {loaderData.registeredSongs} / {loaderData.playlistSize} </p>
      <p>Last update : {loaderData.lastUpdate}</p>
      <p>Repetition interval : {repInterval} min</p>
      <Slider aria-label="Repetition interval"
        step={5}
        onChange={(_, value, __) => setRepInterval(value as number)}
        defaultValue={DEFAULT_INTERVAL}
        min={5}
        max={60} />
    </div>
    <div className="progression-action">
      <Button
        aria-label="Play"
        variant="contained"
        onClick={() => navigate(STUDY_URL(loaderData.playlist_id, repInterval))}
      >
        <PlayArrowIcon />
      </Button>
      <Button
        aria-label="Delete progression"
        variant="contained"
        onClick={onDelete}
      >
        <DeleteIcon />
      </Button>
    </div>
  </div>);
}
