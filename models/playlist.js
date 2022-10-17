const { Schema, model } = require('mongoose');

const playlistSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    tracks: {type: Array},
    published: {type: Boolean},
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    playlist_url: {type: String, required: false}

});

module.exports = model('Playlist', playlistSchema);