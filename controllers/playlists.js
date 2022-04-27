const Playlist = require('../models/playlist');

var request = require('request'); // "Request" library
const user = require('../models/user');
var client_id = '3d0b95c610624b5d946ad0db07b6b683'; // Your client id
var client_secret = process.env.SECRET; // Your secret

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

module.exports = (app) => {

    // create new playlist 

      //new playlist form
      app.get('/playlist/new', (req, res) => {
        res.render('playlist-new');
       });

      // saves new playlist
      app.post('/playlist/new', (req, res) => {
        if (req.user) {
          const userId = req.user._id;
          const playlist = new Playlist(req.body);
          playlist.created_by = userId;

          // playlist.save(() => res.redirect('/playlists'));

          playlist.save().then(() => user.findById(userId))
          .then((user) => {
            user.playlists.unshift(playlist);
            user.save();

            return res.redirect(`/playlist/${playlist._id}`)
          })

          // console.log(playlist)
        } else {
          return res.status(401); // UNAUTHORIZED
        }
        
    });

    // selecting playlists
    app.post('/playlist/choose', async (req, res) => {
        try {
            const playlists = await Playlist.find({}).lean()
            console.log(playlists)
            const track = req.body.track_id;
            console.log(track)
            return res.render('choose-playlist', {track, playlists} )
        } catch (err) {
            console.log(err.message);
          }
        
    });

    // adding track to playlist
    app.post('/playlist/add', async (req, res) => {
        
        try {

            // GETS WHICH PLAYLIST WE SHOULD ADD TOO
            const playlist = await Playlist.findById({_id : req.body.playlist_id}).lean();

            // GETS WHICH TRACK WE WANTED TO ADD
            let track = req.body.track_id;

            request.post(authOptions, function(error, response, body){

                if (!error && response.statusCode === 200){
                  var token = body.access_token;
                  var options = {
                  url: `https://api.spotify.com/v1/tracks/${track}`,
                  headers: {
                      'Authorization': 'Bearer ' + token
                  },
                  json: true
                  }
                }
            
                request.get(options, function(error, response, body) {
                    // gets track object
                    track = body

                    // adds track to playlist
                    Playlist.findOneAndUpdate({_id : playlist._id}, {$push: {tracks:track}}).then((result) => {

                        // returns updated playlist
                        return res.redirect(`/playlist/${playlist._id}`)

                      }).catch ((err) => {
                        console.log(err.message);
                    });
                  
                });
            
              });

            } catch (err) {
                console.log(err.message);
                }
    });


    // displays one playlist
    app.get('/playlist/:id', async (req, res) => {
        try {
            const playlist = await Playlist.findById(req.params.id).lean().populate('created_by')
            return res.render('playlist-show', {playlist})
        } catch(err){
            console.log(err.message);
        }

    });

    // displays all playlists
    app.get('/playlists', async (req, res) =>{
        try {
            const currentUser = req.user;

            const playlists = await Playlist.find({}).lean().populate('created_by')
            return res.render('playlists', {playlists, currentUser})
        } catch(err) {

        }
    })


};