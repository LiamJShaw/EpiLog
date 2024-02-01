const mongoose = require('mongoose');
const slugify = require('slugify');

const tvShowSchema = new mongoose.Schema({
    tvMazeId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
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

// Pre-save middleware to generate slug before saving
tvShowSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

tvShowSchema.index({ tvMazeId: 1 }, { unique: true });

const TVShow = mongoose.model('TVShow', tvShowSchema);

module.exports = TVShow;
