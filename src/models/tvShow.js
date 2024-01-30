const mongoose = require('mongoose');

const tvShowSchema = new mongoose.Schema({
    tvMazeId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    genres: [String],
    averageRuntime: Number,
    premiered: Date,
    image: String,
    status: String,
    summary: String,
    updated: Number,
    language: String,
    imdbId: String
});

tvShowSchema.index({ tvMazeId: 1 }, { unique: true });

const TVShow = mongoose.model('TVShow', tvShowSchema);

module.exports = TVShow;
