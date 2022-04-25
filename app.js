const express = require("express")
const {engine} = require('express-handlebars')
const app = express();
require('dotenv').config({path: '.env'});


var request = require('request'); // "Request" library
var client_id = '3d0b95c610624b5d946ad0db07b6b683'; // Your client id
var client_secret = process.env.SECRET; // Your secret

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
require('./controllers/playlists')(app);
require('./data/app-db');



// harry styles:
// url: 'https://api.spotify.com/v1/artists/6KImCVD70vtIoJWnq6nGn3',


//starts stuff with spotify api
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

// WORKING API CALL
app.get('/', (req, res) => {

  request.post(authOptions, function(error, response, body){

    if (!error && response.statusCode === 200){
      var token = body.access_token;
      var options = {
      url: 'https://api.spotify.com/v1/search?q=lover&type=track&artist=taylor%20swift',
      headers: {
          'Authorization': 'Bearer ' + token
      },
      json: true
      }
    }

    request.get(options, function(error, response, body) {
      // const artist_name = body.name
      // console.log(body.tracks.items);
      
    });

  });

  return res.render('home');
});
  
app.post('/search', (req, res) => {
  // console.log(req.body.search);
  let search = req.body.search
  request.post(authOptions, function(error, response, body){

    if (!error && response.statusCode === 200){
      var token = body.access_token;
      var options = {
      url: `https://api.spotify.com/v1/search?q=track:${search}&type=track&limit=30`,
      headers: {
          'Authorization': 'Bearer ' + token
      },
      json: true
      }
    }

    request.get(options, function(error, response, body) {
      const tracks = body.tracks.items
      // console.log(body.tracks.items)
      // console.log(body.tracks.items[0].album.images[0].url);
    
      return res.render('search-results', {search, tracks})
      
    });

  });
});







app.listen(3000)
