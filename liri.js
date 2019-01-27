require("dotenv").config();
let request = require('request');
let moment = require('moment');
let axios = require("axios");
let keys = require("./keys.js");
let fs = require("fs");
let Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var operation = process.argv[2].trim();
var name = "";

switch (operation) {

    case "concert-this":
        name = process.argv[3].trim();
        concertThis(name);
        break;
    case "spotify-this-song":
        name = process.argv[3].trim();
        spotifyThisSong(name);
        break;
    case "movie-this":
        name = process.argv[3].trim();
        movieThis(name)
        break;
    case "do-what-it-says":
        doWhatItSays()
        break;
}

function concertThis(name) {

    var artist = name;

    if (artist) {

        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryURL, function (error, response, body) {
            if (error) {
                console.log("Error Occured : " + error);
            }
            else {
                var results = JSON.parse(body);
                console.log('Number of concerts= ' + results.length);
                for (var i = 0; i < results.length; i++) {
                    console.log("Name of the venue : " + results[i].venue.name);
                    console.log("Venue location    : " + results[i].venue["city"] + ", " + results[i].venue["country"]);
                    console.log("Date of the Event : " + moment(results[i].datetime, moment.ISO_8601).format("MM/DD/YYYY"));
                    console.log("-------------------------------------------------");
                }
            }
        })
    }
    else {
        console.log("Need an artist name entered with this option")
    }
}

function spotifyThisSong(name) {

    var song = name;

    if (song) {
        spotify
            .search({ type: 'track', query: song })
            .then(function (response) {
                console.log("Artist       :: " + response.tracks.items[0].artists[0].name);
                console.log("Song name    :: " + response.tracks.items[0].name);
                console.log("Link to song :: " + response.tracks.items[3].preview_url);
                console.log("Album name   :: " + response.tracks.items[0].album.name);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    else {
        console.log("Need an song name entered with this option")
    }
}

function movieThis(name) {

    var movie = name;
    var query = "";
    if (movie) {
        query = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    }
    else {
        movie = "Mr. Nobody";
        query = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    }

    axios.get(query).then(
        function (response) {
            console.log("Title of the movie                   :: " + response.data.Title);
            console.log("Year the movie came out              :: " + response.data.Year);
            console.log("IMDB Rating of the movie             :: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating of the movie  :: " + response.data.Ratings[1].value);
            console.log("Country where the movie was produced :: " + response.data.Country);
            console.log("Language of the movie                :: " + response.data.Language);
            console.log("Plot of the movie                    :: \n---------------------------------------\n" + response.data.Plot);
            console.log("Actors in the movie                  :: " + response.data.Actors);
        }
    );
}


function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr[0]);
        console.log(dataArr[1]);

        var opn = dataArr[0].trim();
        var value = dataArr[1].trim();

        switch (opn) {

            case "concert-this":
                concertThis(value);
                break;
            case "spotify-this-song":
                spotifyThisSong(value);
                break;
            case "movie-this":
                movieThis(value);
                break;
            default:
                console.log("Not enough values in file !!!");
        }

    })
}


