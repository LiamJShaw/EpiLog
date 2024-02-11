const express = require('express');
const router = express.Router();

const Film = require('../models/film');

const maxPageSize = 100;

// Search Films
router.get('/search', async (req, res) => {
    let { query, genre, status, releaseDateGte, releaseDateLte, page = 1, pageSize = 10 } = req.query;
    const searchOptions = {};

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    if (query) {
        searchOptions.title = { $regex: new RegExp(query, 'i') }; // Case-insensitive regex search
    }

    if (genre) {
        searchOptions.genres = { $in: [genre] }; // Filter by genre
    }

    if (status) {
        searchOptions.status = status; // Filter by status
    }

    if (releaseDateGte) {
        searchOptions.releaseDate = { $gte: new Date(releaseDateGte) }; // Filter by release date greater or equal
    }

    if (releaseDateLte) {
        searchOptions.releaseDate = { ...searchOptions.releaseDate, $lte: new Date(releaseDateLte) }; // Filter by release date less or equal
    }

    try {
        const films = await Film.find(searchOptions)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const totalItemCount = await Film.countDocuments(searchOptions);

        res.set('X-Page-Number', page.toString());
        res.set('X-Page-Size', pageSize.toString());
        res.set('X-Total-Item-Count', totalItemCount.toString());
        res.set('X-Total-Pages', Math.ceil(totalItemCount / pageSize).toString());

        res.json(films);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const today = new Date();
        const films = await Film.find({
            releaseDate: { $gt: today }
        })
        .sort({ releaseDate: 1 }); // Sort by release date ascending

        res.json(films);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /api/films/:id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const film = await Film.findById(id);

        if (!film) {
            return res.status(404).send('Film not found.');
        }

        res.json(film);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /api/films
// Fetch all films with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const sortBy = req.query.sortBy || 'releaseDate';
    const order = req.query.order || 'desc'; 

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    try {
        const films = await Film.find({})
            .skip(skip)
            .limit(pageSize)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

        const totalItemCount = await Film.countDocuments({});

        res.set('X-Page-Number', page.toString());
        res.set('X-Page-Size', pageSize.toString());
        res.set('X-Total-Item-Count', totalItemCount.toString());
        res.set('X-Total-Pages', Math.ceil(totalItemCount / pageSize).toString());

        res.json(films);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
