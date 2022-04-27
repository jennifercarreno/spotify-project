const Playlist = require('../models/playlist');

var request = require('request'); // "Request" library
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

    // create new post 

      //new post form
      app.get('/playlist/new', (req, res) => {
        res.render('playlist-new');
       });

      // saves new post
      app.post('/playlist/new', (req, res) => {
        const playlist = new Playlist(req.body);
        playlist.save(() => res.redirect('/'));
        console.log(playlist)
    });

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

    app.post('/playlist/add', async (req, res) => {
        
        try {

            // GETS WHICH PLAYLIST WE SHOULD ADD TOO
            const playlist = await Playlist.findById({_id : req.body.playlist_id}).lean();
            // console.log('PLAYLIST:' + playlist)

            // GETS WHICH TRACK WE WANTED TO ADD
            let track = req.body.track_id;

            // console.log('TRACK:' + track)
            // tracks = playlist.tracks


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
                    track = body
                    // console.log(body)
                    // tracks.push(track)
                    // console.log(playlist.tracks)
                    console.log('PLAYLIST outside'  + playlist.tracks)

                    Playlist.findOneAndUpdate({_id : playlist._id}, {$push: {tracks:track}}).then((result) => {
                        // console.log(result)
                        console.log('PLAYLIST inside'  + playlist.tracks)

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

    app.get('/playlist/:id', async (req, res) => {
        try {
            const playlist = await Playlist.findById(req.params.id).lean()
            return res.render('playlist-show', {playlist})
        } catch(err){
            console.log(err.message);
        }

    });

    app.get('/playlists', async (req, res) =>{
        try {
            const playlists = await Playlist.find({}).lean()
            return res.render('playlists', {playlists})
        } catch(err) {

        }
    })


};