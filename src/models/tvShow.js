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
    image: {
        medium: String
    },
    status: String,
    officialSite: String,
    summary: String,
    schedule: {
        time: String,
        days: [String]
    },
    language: String,
    network: {
        name: String,
        country: {
            name: String,
            code: String,
            timezone: String
        },
        officialSite: String
    },
    externals: {
        tvrage: Number,
        thetvdb: Number,
        imdb: String
    },
    updated: Number
});

tvShowSchema.index({ tvMazeId: 1 }, { unique: true });

const TVShow = mongoose.model('TVShow', tvShowSchema);

module.exports = TVShow;
