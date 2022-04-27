const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    title: { type: String, required: true },
    tracks: {type: Array},
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },

});

module.exports = model('Playlist', playlistSchema);