const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    title: { type: String, required: true },
    tracks: {type: Array}
});

module.exports = model('Playlist', playlistSchema);