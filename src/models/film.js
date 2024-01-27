const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    tmdbId: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    title: { 
        type: String, 
        required: true 
    }
});

// Indexing the TMTB ID for efficient querying
filmSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('Film', filmSchema);
