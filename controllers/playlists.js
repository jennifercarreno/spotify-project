const Playlist = require('../models/playlist');
var request = require('request'); // "Request" library
// var Handlebars = require('Handlebars');
const user = require('../models/user');
var client_id = '3d0b95c610624b5d946ad0db07b6b683'; // Your client id
var client_secret = process.env.SECRET; // Your secret
var access = process.env.ACCESS; // Your secret
var refresh = process.env.REFRESH; 

var express = require('express')
var bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');
var code
var redirect_uri = 'http://localhost:3001/callback';

console.log('BEGINNING ACCESS TOKEN: ' + access)
console.log('BEGINNING REFRESH TOKEN: '+ refresh)

//spotiify api auth
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
          playlist.published = false;

          playlist.save(() => res.redirect(`/playlist/${playlist._id}`));

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

    // adding track to playlist
    app.post('/playlist/add', async (req, res) => {
        
        try {

            // GETS WHICH PLAYLIST WE SHOULD ADD TO
            const playlist = await Playlist.findById({_id : req.body.playlist_id}).lean();

            // GETS WHICH TRACK WE WANT TO ADD
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
            const tracks = playlist.tracks
            console.log("PLAYLIST PUBLISHED: " + playlist.published)

            for (i in tracks) {
              // adds playlist attribute to tracks
              tracks[i].playlist = playlist._id;
              console.log("PLAYLIST TRACKS: " + tracks[i].id)

            
            }  

            // checks to see if current user created the playlist
            if((currentUser.username == playlist.created_by.username)&&(playlist.published == false)){
              author = true;
              for (i in tracks) {
                tracks[i].author = true;
              }  
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

// displays all playlists
    app.get('/playlists', async (req, res) =>{
      try {
        const currentUser = req.user;
        const playlists = await Playlist.find({}).lean().populate('created_by')
        let displayed_playlists = []

        for (i in playlists) {
          if (playlists[i].published == true){
            console.log("CURRENT PLAYLIST: " + playlists[i].title + ": " + playlists[i].published)
            displayed_playlists.push(playlists[i])

          }
        }
        return res.render('playlists', {displayed_playlists, currentUser})          

      } catch(err) {
          console.log(err.message);
      }
  });

    
    app.get('/playlists/library/:id', async (req, res) =>{
        try {
          if(req.user._id == req.params.id){
            //gets all playlists by the current user
            const currentUser = req.user;
            const displayed_playlists = await Playlist.find({'created_by': currentUser}).lean().populate('created_by')
            const library = true
            
            return res.render('playlists', {displayed_playlists, currentUser, library})

          } else {
            const currentUser = req.user;
            const displayed_playlists = await Playlist.find({}).lean().populate('created_by')
            return res.render('playlists', {displayed_playlists, currentUser})
          }
            
        } catch(err) {
            console.log(err.message);
        }
    });

// search in playlist
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

// deletes a playlist
    app.get('/playlist/delete/:id', async(req, res) => {
      try {

      Playlist.findOneAndDelete({_id : req.params.id}).then((result) => {
    
      }).catch ((err) => {
        console.log(err.message);
      });
      return res.redirect(`/playlists`)

      } catch(err) {

      }
    });

    app.post('/playlist/deletesong', async(req, res) => {
      try {

        // GETS WHICH PLAYLIST WE SHOULD ADD TO
        console.log('PLAYLIST ID: '+ req.body.playlist)
        const playlist = await Playlist.findById({_id : req.body.playlist}).lean();

        // GETS WHICH TRACK WE WANTED TO ADD
        let track = req.body.track_id_song;
        // console.log('TRACK ID: ' + track)

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
                console.log(track)

                // removes track from playlist
                Playlist.findOneAndUpdate({_id : playlist._id}, {$pull: {tracks:track}}).then((result) => {

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

//publish a playlist
app.get('/playlist/:id/publish', async (req, res) => {
  try {
    if (req.user) {
      const currentUser = req.user;
      
      const playlist = await Playlist.findById(req.params.id).lean().populate('created_by');
      const tracks = playlist.tracks
      
      // checks to see if current user created the playlist
      if(currentUser.username == playlist.created_by.username){

        //GETTING REFRESH TOKEN 
        var refreshAuth = {
          url: 'https://accounts.spotify.com/api/token',
          headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
          form: {
            grant_type: 'refresh_token',
            refresh_token: refresh
          },
          json: true
        };

        request.post(refreshAuth, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
              'access_token': access_token
            });
          }
        });

      

        //PUBLISHING PLAYLIST POST

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
      
              // var access_token = body.access_token,
              //     refresh_token = body.refresh_token;
              
              
              var options = {
                url: 'https://api.spotify.com/v1/users/313oodjlqlgtvp6joqiomhfumlyq/playlists',
                
                headers: {
                  'Authorization': 'Bearer ' + access,
                  'Content-Type': 'application/json'
                },
  
                body: JSON.stringify({
                    'name': playlist.title,
                    'description': 'This CD was burned on burnify. ' + playlist.description,
                    'public': true
                }),
                dataType:'json',
                
                
              }

              request.post(options, function(error, response, body) {
                console.log('BODY: ' + body);
                console.log('JSON BODY: ' + JSON.stringify(body.id));
  
                spotify_playlist = body.id
              });
                  
            }});

        

        // request.post(authOptions, function(error, response, body) {


          
        
            // use the access token to access the Spotify Web API
            // var authOptions = {
            //   url: 'https://accounts.spotify.com/api/token',
            //   form: {
            //     code: code,
            //     redirect_uri: redirect_uri,
            //     grant_type: 'authorization_code'
            //   },
            //   headers: {
            //     'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            //   },
            //   json: true
            // };

            

            
                
            

           

            

            // for (i in tracks) {
            //   console.log('TRACK[I].ID: '+ tracks[i].id)
            //   const track = "spotify:track:"+tracks[i].id
            //   console.log('TRACK: ' + track)
            //   console.log('PLAYLIST ID: ' + spotify_playlist)
  
            //   var addTracks = {
            //     url: 'https://api.spotify.com/v1/playlists/{playlist_id}/tracks',
    
            //     headers: {
            //       'Authorization': 'Bearer ' + token,
            //       'Content-Type': 'application/json'
            //     },
    
            //     body: JSON.stringify({
            //       'uris': track,
                  
            //   }),
            //   dataType:'json',
    
            //   }

            //   request.post(addTracks, function(error, response, body) {
            //     console.log(body);
            //   });
            // }

          
          

          


        // playlist.published = true;
        console.log("PUBLISHED: " + playlist.published)
        // Playlist.findOneAndUpdate({_id : playlist._id}, {published: true}).then((result) => {
      //   res.redirect(`/playlist/${playlist._id}`)}).catch ((err) => {
      //     console.log(err.message);
      // });

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




};