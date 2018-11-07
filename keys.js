// console.log("keys.js is loaded");

// Spotify API object:
const spotifyApi = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

// OMDB API & Bands In Town API object:
const apiData = {
    omdbApi: process.env.OMDB_API,
    BandsInTownApi: process.env.BIT_ID
};

//Export files with node.js module:
module.exports = { spotifyApi, apiData }