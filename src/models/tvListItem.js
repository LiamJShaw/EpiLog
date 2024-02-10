const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tvListItemSchema = new Schema({
    tvShow: { type: Schema.Types.ObjectId, ref: 'TVShow' },
    status: {
        type: String,
        enum: ['Watching', 'Completed', 'On Hold', 'Up To Date', 'Plan to Watch'],
        default: 'Plan to Watch'
    },
    episodesWatched: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    startDate: {
        type: Date,
        default: null
    },
    finishDate: {
        type: Date,
        default: null
    },
    totalRewatches: {
        type: Number,
        default: 0
    }
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

tvListItemSchema.index({ tvShow: 1 });

const TVListItem = mongoose.model('TVListItem', tvListItemSchema);

module.exports = TVListItem;