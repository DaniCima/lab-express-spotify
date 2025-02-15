require("dotenv").config();
const port = 3008;

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;
  // let artistName = req.query.artist
  // console.log(req.query);
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      // console.log("The received data from Api ", data.body.artists.items);
      const info = {
        image: data.body.artists.items[0].images[0].url,
        name: data.body.artists.items[0].name,
        id: data.body.artists.items[0].id,
      };
      // console.log(info);
      res.render("artist-search-results", { info });
    })
    .catch((err) => console.log(err));
});

app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;
  // console.log("this id: " + req.params.id);
  spotifyApi
    .getArtistAlbums(id)
    .then((albResponse) => {
      // const info1 = {
      //   image: albResponse.body.items,
      //   // name: albResponse.body.items.name,
      //   // trackId: albResponse.body.items[0].id,
      // };
      res.render("albums", { albums: albResponse.body.items });
      console.log("Artist albums", albums);
    })
    .catch((err) => console.log(err));
});

app.listen(3008, () =>
  console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`)
);
