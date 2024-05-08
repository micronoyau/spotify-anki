import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbGetStudySongs, dbGetUserProgression, dbResetPlaylistProgression, dbUpdateStudySong } from "./db/study";
import { oauthCallback, oauthLogin, oauthRefreshToken } from "./oauth";
import { UPLOADS_DIR } from "./consts";
import { setupDB } from "./db/setup";

const app = express();

app.use(fileupload({ createParentPath: true }));

app.use(cors())
  .use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupDB();

// Static audio file server
app.use('/audio', express.static(UPLOADS_DIR));

// Oauth setup
app.get('/login', oauthLogin)
app.get('/callback', oauthCallback)
app.get('/refresh_token', oauthRefreshToken)

// Test for db
// app.get('/testdb', dbTest);
// app.get('/register_user/:user_id/:username', dbRegisterUser);
// app.get('/user/:user_id', dbGetUserData);

// Study db interactions
app.get('/get_study_songs/:user_id/:playlist_id/:rep_interval', dbGetStudySongs);
app.get('/update_study_song/:user_id/:playlist_id/:song_id/:quality', dbUpdateStudySong);
app.get('/progression/:user_id/:playlist_id/:rep_interval', dbGetUserProgression);
app.get('/reset_progression/:user_id/:playlist_id', dbResetPlaylistProgression);

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})

