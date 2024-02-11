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
    slug: {
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
}, {
    toJSON: {
      transform: function(doc, ret) {
        delete ret.__v;
      },
    },
    toObject: {
      transform: function(doc, ret) {
        delete ret.__v;
    }}
  });

// Pre-save middleware to generate slug before saving
filmSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

filmSchema.index({ tmdbId: 1 }, { unique: true });

const Film = mongoose.models.Film || mongoose.model('Film', filmSchema);

module.exports = Film;
