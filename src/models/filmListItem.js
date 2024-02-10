const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmListItemSchema = new Schema({
    film: { type: Schema.Types.ObjectId, ref: 'Film' },
    status: {
        type: String,
        enum: ['Watched', 'Plan to Watch'],
        default: 'Plan to Watch'
    },
    score: {
        type: Number,
        min: 0,
        max: 10
    },
    notes: String,
    watchDate: Date,
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

const FilmListItem = mongoose.model('FilmListItem', filmListItemSchema);

module.exports = FilmListItem;