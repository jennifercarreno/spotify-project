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


};