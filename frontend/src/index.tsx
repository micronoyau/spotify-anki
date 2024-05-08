import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import { Root } from './routes/root';
import { IndexPage } from './routes/index-page';
import { ErrorPage } from './routes/error-page';
import { HomePage, playlistLoader } from './routes/home-page';
import { APIErrorPage } from './routes/api-error-page';
import { spotifyAPILoader } from './lib/spotify-api';
import { quizLoader, QuizPage } from './routes/game/quiz-page';
import { studyLoader, StudyPage } from './routes/game/study-page';
import { progressionLoader, ProgressionPage } from './routes/game/progression-page';
import { LoginPage } from './routes/login-page';
import { hardcoreLoader, HardcorePage } from './routes/game/hardcore-page';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        loader: spotifyAPILoader,
        errorElement: <APIErrorPage />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/home",
            element: <HomePage />,
            loader: playlistLoader,
          },
          {
            path: "/progression/:playlist_id",
            loader: progressionLoader,
            element: <ProgressionPage />,
          },
          {
            path: "/study/:playlist_id/:rep_interval",
            loader: studyLoader,
            element: <StudyPage />,
          },
          {
            path: "/quiz/:playlist_id",
            element: <QuizPage />,
            loader: quizLoader,
          },
          {
            path: "/hardcore/:playlist_id",
            element: <HardcorePage />,
            loader: hardcoreLoader,
          },
        ]
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
