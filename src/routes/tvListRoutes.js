const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const User = require('../models/user');
const TVListItem = require('../models/tvListItem');
const FilmListItem = require('../models/filmListItem');
const TVShow = require('../models/tvShow');
const Film = require('../models/film');

// Get user's TV list
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate({
            path: 'tvList',
            populate: { // Deep populate to get TV show details
                path: 'tvShow',
                select: 'title' // Gets only the show title
                // select: 'title genres' // Can do more like this
            } 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({ tvList: user.tvList });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to add a TV show to the user's list
router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const { tvShowId, status, episodesWatched, score, notes, startDate, finishDate, totalRewatches } = req.body;

    try {
        // Check if the TV Show exists
        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) {
            return res.status(404).json({ message: 'TV show not found!' });
        }

        // Fetch only the tvList ids from the user
        const user = await User.findById(userId).select('tvList');

        // Check if the TV show is already in the user's list
        const existingItem = await TVListItem.findOne({ 
            _id: { $in: user.tvList }, // Check if the id is in the user's list of tvList ids
            tvShow: tvShowId // Check if the tvShow matches the provided tvShowId
        });
        if (existingItem) {
            return res.status(409).json({ message: 'TV show already in your list!' });
        }

        // Create and add the TV show list item to the user's list
        const tvListItem = new TVListItem({
            tvShow: tvShowId,
            status: status,
            episodesWatched: episodesWatched,
            score: score,
            notes: notes,
            startDate: startDate ? new Date(startDate) : undefined,
            finishDate: finishDate ? new Date(finishDate) : undefined,
            totalRewatches: totalRewatches
        });

        await tvListItem.save();

        // Add the new TVListItem id to the user's tvList
        user.tvList.push(tvListItem._id);
        await user.save();

        res.status(200).json({ message: 'TV show added to your list!', tvList: tvListItem });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to get a specific TV list item
router.get('/:tvListItemId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id; // User ID from the JWT
    const tvListItemId = req.params.tvListItemId;

    try {
        // Fetch the user and their tvList
        const user = await User.findById(userId).select('tvList');
        
        // Check if the tvListItemId is in the user's tvList
        if (!user.tvList.includes(tvListItemId)) {
            return res.status(404).json({ message: 'TV list item not found or does not belong to the user!' });
        }
        
        // Fetch the TVListItem and populate tvShow
        const tvListItem = await TVListItem.findById(tvListItemId).populate('tvShow');
        
        // Additional check to ensure tvListItem exists
        if (!tvListItem) {
            return res.status(404).json({ message: 'TV list item not found!' });
        }

        res.status(200).json({ tvListItem });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to remove a specific TV show from the user's list
router.delete('/:tvListItemId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const tvListItemId = req.params.tvListItemId; // Get the ID from the URL parameter

    try {
        // Fetch the user and their tvList
        const user = await User.findById(userId).select('tvList');
        
        // Check if the tvListItemId is in the user's tvList
        if (!user.tvList.includes(tvListItemId)) {
            return res.status(404).json({ message: 'TV list item not found or does not belong to the user!' });
        }

        // Remove the TV show list item from the user's list and the TVListItem collection
        await TVListItem.findByIdAndDelete(tvListItemId);
        await User.findByIdAndUpdate(userId, {
            $pull: { tvList: tvListItemId }
        });

        res.status(200).json({ message: 'TV show removed from your list!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to update a specific TV show in the user's list
router.put('/:tvListItemId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const tvListItemId = req.params.tvListItemId; // Get the ID from the URL parameter

    try {
        // Fetch the user and their tvList
        const user = await User.findById(userId).select('tvList');
        
        // Check if the tvListItemId is in the user's tvList
        if (!user.tvList.includes(tvListItemId)) {
            return res.status(404).json({ message: 'TV list item not found or does not belong to the user!' });
        }

        // Update the TV show list item
        // Specify which fields should be allowed to be updated to avoid updating unintended fields
        const allowedUpdateFields = ['status', 'episodesWatched', 'score', 'notes', 'startDate', 'finishDate', 'totalRewatches'];
        const updateData = allowedUpdateFields.reduce((acc, field) => {
            if (req.body.hasOwnProperty(field)) {
                acc[field] = req.body[field];
            }
            return acc;
        }, {});

        const updatedTVListItem = await TVListItem.findByIdAndUpdate(tvListItemId, updateData, { new: true }).populate('tvShow');
        
        if (!updatedTVListItem) {
            return res.status(404).json({ message: 'TV list item not found!' });
        }

        res.status(200).json({ message: 'TV show updated successfully!', tvList: updatedTVListItem });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;