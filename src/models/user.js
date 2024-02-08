const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    bio: { type: String },
    tvList: [{ type: Schema.Types.ObjectId, ref: 'TVListItem' }],
    filmList: [{ type: Schema.Types.ObjectId, ref: 'FilmListItem' }],
    favouriteTVShows: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TVShow',
        max: 20 // You can enforce the cap in your application logic
    }],
    favouriteFilms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        max: 20 // You can enforce the cap in your application logic
    }],
});

// Password hash middleware
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

// Helper method for validating user's password
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
