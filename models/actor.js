const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    first_name: { type: String, required: true },
    family_name: { type: String, required: true },
});

// Virtual for actor's name
ActorSchema.virtual("url").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for actor's URL
ActorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/actors/${this._id}`;
});


// Export model
module.exports = mongoose.model("Actor", ActorSchema);
