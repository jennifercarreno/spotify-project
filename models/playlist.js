const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    title: { type: String, required: true }
});

module.exports = model('Playlist', playlistSchema);