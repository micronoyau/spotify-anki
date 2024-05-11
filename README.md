# Spotanki

## Improve your music quizz skills !

**Spotanki** is the natural combination of Spotify and Anki. Take advantage of anki's repetition-based teaching strategy to sharpen your ability to recognize songs.

### Usage

Simply connect to your Spotify account, select a playlist and you're ready to enjoy 3 modes :
 + Study : anki-based learning method using flashcards
 + Quizz : select the right answer among 4 choices
 + Hardcore : 3 songs are playing at the same time. Will you be able to recognize them ?

### Setup

#### Requirements

+ docker (tested on version 26.1.2)
+ docker-compose (tested on version 1.29.2)
+ node (tested on version 18.19.0)
+ A Spotify app (see spotify developer https://developer.spotify.com/documentation/web-api)

#### Configuration

You need to provide a `.env` file in `/backend` that contains the credentials of your Spotify app. A sample template file is provided.

#### Development mode

You can either run your the locally or deploy it. If you'd like to tweak some settings, feel free to use the development mode 

```
npm run dev
```

The development version will be served locally at http://localhost:3000.

#### Production build

To run the production build, first fill a `.env.prod` file at the root of the project that contains the URL of the backend and the frontend. A template file is provided. Then run

```
npm run prod
```
