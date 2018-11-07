//DEPENDENCIES!
//Configure dotenv:
require('dotenv').config()
//File system:
const fs = require('fs');
//Request:
const request = require('request');
//Moment.js:
const moment = require('moment');
//keys.js file:
const keys = require('./keys');
//Spotify API:
const Spotify = require('node-spotify-api');
//Export module Spotify API Keys:
const spotify = new Spotify(keys.spotifyApi);
let spotId = spotify.credentials.id;
let spotSecret = spotify.credentials.secret;
// // console.log("spotify-id: ", spotId);
// // console.log("spotify-secret: ", spotSecret);
//Export module OMDB & Bands In Town (BIT) API Info
const api = keys.apiData;
let omdb = api.omdbApi;
let bit = api.BandsInTownApi;
// // console.log("OMDB API: ", omdb);
// // console.log("Bands In Town API: ", bit);

//Grab user command:
let userInput = process.argv[2];
//Grab the user query:
let userQuery = process.argv.slice(3).join(" ");
// console.log("User search input: ", userQuery);

//Make a decision based on the commands:
switch (userInput) {
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "concert-this":
        concertThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log('Not found, ask Foogle Bot!');
        break;
};

function spotifyThisSong() {
    spotify.search({ type: 'track', query: userQuery, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data);

        //Give the for loop an array:
        let arrayLimit = data.tracks.items;

        for (i = 0; i < arrayLimit.length; i++) {
            console.log("🎧");
            console.log("Artist(s): ", data.tracks.items[i].album.artists[0].name);
            console.log("Song: ", data.tracks.items[i].name);
            console.log("Spotify link: ", data.tracks.items[i].external_urls.spotify);
            console.log("Album: ", data.tracks.items[i].album.name);
            console.log('- - -');
        };
    });
    // TODO Should the user define the limit search?
    // TODO How to access all the names of artists?
    // TODO If no song is provided then your program will default to "The Sign" by Ace of Base.
};

function movieThis() {
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=" + omdb, function (error, response, body) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
            // Parse the response into a JSON format
            let movie = JSON.parse(body);
            // console.log(movie);

            console.log("🎦 ");
            console.log("Title: ", movie.Title);
            console.log("Year: ", movie.Year);
            console.log("Rated: ", movie.Rated);
            console.log("Rotten Tomatoes Rating: ", movie.Ratings[1].Value);
            console.log("Country: ", movie.Country);
            console.log("Language: ", movie.Language);
            console.log("Plot: ", movie.Plot);
            console.log("Actors: ", movie.Actors);
            console.log('- - -');
        };
        // TODO If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    });
};

function concertThis() {
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bit, function (error, response, body) {
        // If the request was successful...

        if (!error && body !== [] && response.statusCode === 200) {
            // Parse the response into a JSON format
            let band = JSON.parse(body);
            console.log(body);

            // for (i = 0; i < 5; i++) {
            //     console.log("🎸");
            //     console.log("Artist: ", band[i].lineup[0]);
            //     console.log("Venue:", band[i].venue.name);
            //     console.log(`Location: ${band[i].venue.city}, ${band[i].venue.country}`);
            //     // Moment.js to format the date:
            //     let date = moment(band[i].datetime).format("MM/DD/YYYY hh:00 A");
            //     console.log("Date and time:", date);
            //     console.log('- - -');
            // };
        } else {
            console.log('Band or concert not found!');

        };
        // TODO console.log("Band not found...")
    });
};

// // EXAMPLE from Request package:
// request('http://www.google.com', function (error, response, body) {
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// });

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
function doWhatItSays() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // console.log(data);

        // Split the data in the random.txt file with commas and put it in an array:
        let dataArr = data.split(",");
        // Put the contents from the array as the user input and query:
        userInput = dataArr[0];
        userQuery = dataArr[1];
        // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
        if (userInput === "spotify-this-song") {
            spotifyThisSong();
        } else if (userInput === "movie-this") {
            movieThis();
        } else if (userInput === "concert-this") {
            concertThis();
        } else {
            console.log("It says nothing!\nRun a different command: spotify-this | movie-this | concert-this");
        };
    });
};
