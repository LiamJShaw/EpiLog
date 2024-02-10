const express = require('express');
const router = express.Router();
const passport = require('passport');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

// User registration
router.post('/register', async (req, res) => {
    try {
        const newUser = new User({ 
            username: req.body.username, 
            password: req.body.password,
            email: req.body.email
        });

        await newUser.save();
        res.status(200).send("Registration successful!");

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// User login
router.post('/login', passport.authenticate('local'), (req, res) => {
    const payload = { id: req.user.id, username: req.user.username };
    const token = jwt.sign(payload, process.env.EPILOG_SECRET, { expiresIn: '1h' }); // '1h' means the token expires in one hour
    
    res.status(200).json({ 
        message: "Logged in successfully.",
        token: token
    });
});

// User logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// User profile
router.get('/:userID/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({ userProfile: user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// User profile accessible by anyone, but gets more info with a valid JWT for that user
router.get('/profile/:userId', passport.authenticate('jwt', { session: false, failWithError: true }), async (req, res, next) => {
    const profileUserId = req.params.userId; // ID from the URL

    try {
        const userDoc = await User.findById(profileUserId, '-password'); //.lean(); // Use lean() for performance if you don't need a full Mongoose document

        const user = userDoc.toObject();

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Determine if the current user is viewing their own profile
        const viewingOwnProfile = req.user && req.user.id === profileUserId;

        if (viewingOwnProfile) {
            // The user is viewing their own profile, return full info
            res.status(200).json({ userProfile: user });
        } else {
            // The user is viewing someone else's profile, sanitise accordingly
            delete user.email; 
            // delete user.anyOtherSensitiveFields; // Example of removing private information

            res.status(200).json({ userProfile: user });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});




// Protected route example. Must be logged in to view.
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {

    // Sanitise user object to remove sensitive information
    const user = req.user.toObject();
    delete user.password; // Remove password property
    delete user.__v; // Remove version key if not needed

    // Send the sanitised user object
    res.json({ message: 'Success! You can access protected routes!', user: user });
});

// Admin only route
router.get('/admin', passport.authenticate('jwt', { session: false }), isAdmin, (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;