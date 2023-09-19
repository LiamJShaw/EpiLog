const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShowSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    episode_count: { type: Number, required: true },
    episode_length: { type: Number, required: true },
    actor: [{ type: Schema.Types.ObjectId, ref: "Actor" }],
});

// Virtual for show's URL
ShowSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/shows/${this._id}`;
});

// Export model
module.exports = mongoose.model("Show", ShowSchema);
