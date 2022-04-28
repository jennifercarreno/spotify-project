const Playlist = require('../models/playlist');
var request = require('request'); // "Request" library
var Handlebars = require('Handlebars');
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
        const currentUser = req.user;
        res.render('playlist-new', {currentUser});
       });

      // saves new playlist
      app.post('/playlist/new', (req, res) => {
        if (req.user) {
          const currentUser = req.user;
          const userId = req.user._id;
          const playlist = new Playlist(req.body);
          playlist.created_by = userId;

          playlist.save(() => res.redirect('/playlists'));

          playlist.save().then(() => user.findById(userId))
          .then((user) => {
            user.playlists.unshift(playlist);
            user.save();

            return res.redirect(`/playlist/${playlist._id}`, {currentUser})
          })

          // console.log(playlist)
        } else {
          return res.status(401); // UNAUTHORIZED
        }
        
    });

    // selecting playlists
    app.post('/playlist/choose', async (req, res) => {
        try {
            const currentUser = req.user;
            const playlists = await Playlist.find({'created_by': currentUser}).lean()
            const track = req.body.track_id;
            return res.render('choose-playlist', {track, playlists, currentUser} )
        } catch (err) {
            console.log(err.message);
          }
        
    });

    // adding track to playlist
    app.post('/playlist/add', async (req, res) => {
        
        try {

            // GETS WHICH PLAYLIST WE SHOULD ADD TO
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
          if (req.user) {
            const currentUser = req.user;
            let author;
            const search = req.body.search;
            const playlist = await Playlist.findById(req.params.id).lean().populate('created_by');

            if(currentUser.username == playlist.created_by.username){
              author = true;
              return res.render('playlist-show', {playlist, currentUser, search, author})

            } else {
              return res.render('playlist-show', {playlist, currentUser, search})

            }
          } else {
            const currentUser = req.user;
            const search = req.body.search;
            const playlist = await Playlist.findById(req.params.id).lean().populate('created_by');
            return res.render('playlist-show', {playlist, currentUser, search})


          }
            
            
        } catch(err){
            console.log(err.message);
        }

    });

    app.get('/playlists', async (req, res) =>{
      try {
       
        const currentUser = req.user;
        const playlists = await Playlist.find({}).lean().populate('created_by')
        return res.render('playlists', {playlists, currentUser})
        
          
      } catch(err) {
          console.log(err.message);
      }
  });

    // displays all playlists
    app.get('/playlists/library/:id', async (req, res) =>{
        try {
          if(req.user._id == req.params.id){
            const currentUser = req.user;
            const playlists = await Playlist.find({'created_by': currentUser}).lean().populate('created_by')
            return res.render('playlists', {playlists, currentUser})

          } else {
            const currentUser = req.user;
            const playlists = await Playlist.find({}).lean().populate('created_by')
            return res.render('playlists', {playlists, currentUser})
          }
            
        } catch(err) {
            console.log(err.message);
        }
    });


    app.post('/playlist/search/:id', async(req, res) => {
      try {
        const currentUser = req.user;
        const playlist = await Playlist.findById(req.params.id).lean().populate('created_by');
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

          for (i in tracks) {
            // adds playlist attribute to tracks
            tracks[i].playlist = playlist._id;
          }          
          return res.render('playlist-show', {search, tracks, playlist, currentUser})
        });
        
      });
    } catch (err) {
      console.log(err.message);
    }
    });

    app.get('/playlist/delete/:id', async(req, res) => {
      try {
        Playlist.findOneAndDelete({_id : req.params.id}).then((result) => {

          // returns updated playlist
          return res.redirect(`/playlists`)

        }).catch ((err) => {
          console.log(err.message);
      });

      } catch(err) {

      }
    })




};