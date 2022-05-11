const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    title: { type: String, required: true },
    tracks: {type: Array},
    published: {type: Boolean},
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },

});

module.exports = model('Playlist', playlistSchema);