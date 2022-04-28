require('dotenv').config({path: '.env'});

const express = require("express")
const {engine} = require('express-handlebars')
const app = express();
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');
const Playlist = require('./models/playlist');
const request = require('request'); // "Request" library
const client_id = '3d0b95c610624b5d946ad0db07b6b683'; // Your client id
const client_secret = process.env.SECRET; // Your secret
const User = require('./models/user');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(checkAuth);

require('./controllers/playlists')(app);
require('./controllers/auth.js')(app);
require('./data/app-db');




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
  const currentUser = req.user;
  // console.log(currentUser)

  return res.render('home', {currentUser});

});
  
app.post('/search', async(req, res) => {
  try {
    const currentUser = req.user;
    console.log(currentUser)

  // console.log(req.body.search);
  let search = req.body.search
  
  let playlists = await Playlist.find({}).lean()
  // console.log(search)

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
      const currentUser = req.user;
      console.log(currentUser)

      return res.render('search-results', {search, tracks, currentUser})

      
    });
    
  });
} catch (err) {
  console.log(err.message);
}
});







app.listen(3000)
