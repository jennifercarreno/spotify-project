const Playlist = require('../models/playlist');

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
            const playlist = await Playlist.findById(req.body.playlist_id);
            console.log('PLAYLIST:' + playlist)
            const track = req.body.track_id;
            console.log('TRACK:' + track)
            tracks = playlist.tracks

            tracks.push(track)

            console.log('NEW PLAYLIST:' + playlist)

        } catch (err) {
            console.log(err.message);
        }
    });


};