const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const User = require('../models/user');

const FilmListItem = require('../models/filmListItem');
const Film = require('../models/film');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate({
            path: 'filmList',
            populate: {
                path: 'film',
                select: 'title genres releaseDate' // Customize the selected fields as needed
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({ filmList: user.filmList });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const { filmId, status, score, notes, watchDate, totalRewatches } = req.body;

    try {
        // Ensure the film exists
        const film = await Film.findById(filmId);
        if (!film) {
            return res.status(404).json({ message: 'Film not found!' });
        }

        // Ensure the film is not already in the user's list
        const userFilmListItems = await FilmListItem.find({
            '_id': { $in: (await User.findById(userId)).filmList },
            'film': filmId
        });

        if (userFilmListItems.length > 0) {
            return res.status(409).json({ message: 'Film already in your list!' });
        }

        // Since the film is not in the list, create a new FilmListItem
        const filmListItem = new FilmListItem({
            film: filmId,
            user: userId,
            status,
            score,
            notes,
            watchDate: watchDate ? new Date(watchDate) : undefined,
            totalRewatches
        });

        await filmListItem.save();

        // Update the user's filmList with the new FilmListItem's ID
        await User.findByIdAndUpdate(userId, {
            $push: { filmList: filmListItem._id }
        });

        res.status(200).json({ message: 'Film added to your list!', filmList: filmListItem });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/:filmListItemId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const filmListItemId = req.params.filmListItemId;

    try {
        const user = await User.findById(userId).select('filmList');
        if (!user.filmList.includes(filmListItemId)) {
            return res.status(404).json({ message: 'Film list item not found or does not belong to the user!' });
        }

        const filmListItem = await FilmListItem.findById(filmListItemId).populate('film');
        if (!filmListItem) {
            return res.status(404).json({ message: 'Film list item not found!' });
        }

        res.status(200).json({ filmListItem });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:filmListItemId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const filmListItemId = req.params.filmListItemId;

    try {
        const user = await User.findById(userId);
        if (!user.filmList.includes(filmListItemId)) {
            return res.status(404).json({ message: 'Film list item not found or does not belong to the user!' });
        }

        await FilmListItem.findByIdAndDelete(filmListItemId);
        await User.findByIdAndUpdate(userId, { $pull: { filmList: filmListItemId } });

        res.status(200).json({ message: 'Film removed from your list!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:filmListItemId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;
    const filmListItemId = req.params.filmListItemId;
    const updateData = { ...req.body };

    try {
        const user = await User.findById(userId).select('filmList');
        if (!user.filmList.includes(filmListItemId)) {
            return res.status(404).json({ message: 'Film list item not found or does not belong to the user!' });
        }

        const updatedFilmListItem = await FilmListItem.findByIdAndUpdate(filmListItemId, updateData, { new: true }).populate('film');
        if (!updatedFilmListItem) {
            return res.status(404).json({ message: 'Film list item not found!' });
        }

        res.status(200).json({ message: 'Film updated successfully!', filmList: updatedFilmListItem });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;