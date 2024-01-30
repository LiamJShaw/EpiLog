const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    backdropPath: String,
    imdbId: String,
    originalLanguage: String,
    overview: String,
    posterPath: String,
    releaseDate: Date,
    runtime: Number,
    status: String,
    tagline: String,
    updated: Date
});

filmSchema.index({ tmdbId: 1 }, { unique: true });

const Film = mongoose.models.Film || mongoose.model('Film', filmSchema);

module.exports = Film;
