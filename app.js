
require('dotenv').config({path: '.env'});

const express = require("express")
const {engine} = require('express-handlebars')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const checkAuth = require('./middleware/checkAuth');
const Playlist = require('./models/playlist');
const request = require('request'); // "Request" library
const client_id = '3d0b95c610624b5d946ad0db07b6b683'; // Your client id
const client_secret = process.env.SECRET; // Your secret
const User = require('./models/user');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use('/controllers/playlists', bodyParser.json())
app.use('/controllers/playlists', express.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(checkAuth);




require('./controllers/playlists')(app);
require('./controllers/auth.js')(app);
require('./controllers/spotify-account.js')(app);
require('./controllers/spotify-test.js')(app);


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

// home page
app.get('/', (req, res) => {
  const currentUser = req.user;
  
  return res.render('home', {currentUser});

});

//search
app.post('/search', async(req, res) => {
  try {
    const currentUser = req.user;

    //gets all playlists of current user
    const playlists = await Playlist.find({'created_by': currentUser}).lean().populate('created_by')
    console.log(playlists)
    let search = req.body.search
  

    //searches for tracks
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

      //gets tracks
      const tracks = body.tracks.items
      const currentUser = req.user;

      // "assigns" playlists to tracks
      for (i in tracks) {
        tracks[i].playlist = []

        for (n in playlists) {
          tracks[i].playlist.push(playlists[n]);
          // console.log(tracks[i].playlist)

        }
      }


      return res.render('search-results', {search, tracks, currentUser})
      
    });
    
  });


}catch (err) {
  console.log(err.message);
}

  });







app.listen(3001)
