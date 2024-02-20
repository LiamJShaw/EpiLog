require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/user');

const userRoutes = require('./routes/userRoutes');
const tvRoutes = require('./routes/tvRoutes');
const filmRoutes = require('./routes/filmRoutes');
const tvListRoutes = require('./routes/tvListRoutes');
const filmListRoutes = require('./routes/filmListRoutes');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json()); 

// Error handler for JSON Syntax Error
app.use((err, req, res, next) => {
    // Check for syntax error or any other type of bodyParser error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // console.error(err);
        return res.status(400).json({ status: 400, message: 'Bad request. The JSON payload is malformed.' }); // Bad request
    }
    // If it's not a SyntaxError, pass it to the next error handler
    next(err);
});

const session = require('express-session');

app.use(session({
  secret: process.env.EPILOG_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // set to true when using https
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
      const user = await User.findById(jwtPayload.id);
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
app.use('/api/tv', tvRoutes);
app.use('/api/film', filmRoutes);
app.use('/api/user', userRoutes)
app.use('/api/user/tvlist', tvListRoutes);
app.use('/api/user/filmlist', filmListRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});