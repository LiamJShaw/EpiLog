require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/user');

const userRoutes = require('./routes/userRoutes');
const tvRoutes = require('./routes/tvRoutes');
const filmRoutes = require('./routes/filmRoutes');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

const session = require('express-session');

app.use(session({
  secret: process.env.EPILOG_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true } // set to true when using https
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Passport.js setup for frontend security
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) { 
                return done(null, false); // user not found
            }
            
            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user); // success
                } else {
                    return done(null, false); // password does not match
                }
            });
        } catch (err) {
            return done(err); // error during user lookup
        }
    }
));
  
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.EPILOG_SECRET
}, async (jwtPayload, done) => {
  try {
      const user = await User.findById(jwtPayload.id); // Use async/await here
      if (user) {
          return done(null, user);
      } else {
          console.log("User not found");
          return done(null, false);
      }
  } catch (err) {
      console.log("Error finding user:", err);
      return done(err, false);
  }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


// Use routes
app.use('/api/user', userRoutes)
app.use('/api/tv', tvRoutes);
app.use('/api/film', filmRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});