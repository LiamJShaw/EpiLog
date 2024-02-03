const express = require('express');
const router = express.Router();
const passport = require('passport');

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const TVShow = require('../models/tvShow');

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

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

// Add a TV show to the user's list
router.post('/addshow', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const tvShowId = new ObjectId(req.body.tvShowId); // Convert string to ObjectId using MongoDB's ObjectId

    try {
        // Check if the TV Show exists
        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) {
            return res.status(404).json({ message: 'TV show not found!' });
        }

        // Find the user and update their tvList
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { tvList: tvShowId }
        }, { new: true }).populate('tvList'); // Populate to return updated list

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({ message: 'TV show added to your list!', tvList: user.tvList });
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