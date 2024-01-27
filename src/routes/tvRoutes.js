const express = require('express');
const axios = require('axios');

const router = express.Router();

const TVShow = require('../models/tvShow');

const maxPageSize = 100;

// Search TV shows
router.get('/search', async (req, res) => {
    let { query, genre, status, premieredAfter, premieredBefore, page = 1, pageSize = 10 } = req.query;
    const searchOptions = {};

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    if (query) {
        searchOptions.name = { $regex: new RegExp(query, 'i') }; // Case-insensitive regex search
    }

    if (genre) {
        searchOptions.genres = { $in: [genre] }; // Filter by genre
    }

    if (status) {
        searchOptions.status = status; // Filter by status
    }

    if (premieredAfter) {
        searchOptions.premiered = { $gte: new Date(premieredAfter) }; // Filter by premiered after
    }

    if (premieredBefore) {
        searchOptions.premiered = { ...searchOptions.premiered, $lte: new Date(premieredBefore) }; // Filter by premiered before
    }

    try {
        const tvShows = await TVShow.find(searchOptions)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const totalItemCount = await TVShow.countDocuments(searchOptions);

        res.set('X-Page-Number', page.toString());
        res.set('X-Page-Size', pageSize.toString());
        res.set('X-Total-Item-Count', totalItemCount.toString());
        res.set('X-Total-Pages', totalPages.toString());        
        
        res.json(tvShows);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /api/tvshows/:id
router.get('/:id', async (req, res) => {
    try {
        const tvShowId = req.params.id;
        const liveInfo = req.query.liveInfo === 'true';

        if (liveInfo) {
            // Fetch live information from the TVMaze API
            const tvMazeResponse = await axios.get(`https://api.tvmaze.com/shows/${tvShowId}`);
            const liveData = tvMazeResponse.data;
            return res.json(liveData);
        }

        // Fetch information from the local database
        const tvShow = await TVShow.findOne({ tvMazeId: tvShowId });

        if (!tvShow) {
            return res.status(404).send('TV show not found.');
        }

        res.json(tvShow);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('TV show not found on TVMaze.');
        }
        res.status(500).send(error.message);
    }
});


// GET /api/tvshows/:id/episodes
// Fetch the number of episodes for a specific TV show
router.get('/:id/episodes', async (req, res) => {
    try {
        const tvShowId = req.params.id;
        
        // Fetch all episodes for the given TV show ID from TVMaze API
        const response = await axios.get(`https://api.tvmaze.com/shows/${tvShowId}/episodes`);
        const episodes = response.data;

        // Count the number of episodes
        const episodeCount = episodes.length;

        // Return the episode count
        res.json({ tvShowId, episodeCount });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('TV show not found on TVMaze.');
        }
        res.status(500).send(error.message);
    }
});

// GET /api/tvshows/:id/seasons
// Fetch seasons and episode information for a specific TV show
router.get('/:id/seasons', async (req, res) => {
    try {
        const tvShowId = req.params.id;
        
        // Fetch all seasons for the given TV show ID from TVMaze API
        const seasonsResponse = await axios.get(`https://api.tvmaze.com/shows/${tvShowId}/seasons`);
        const seasons = seasonsResponse.data;

        // For each season, fetch episodes
        const seasonsWithEpisodes = await Promise.all(seasons.map(async (season) => {
            const episodesResponse = await axios.get(`https://api.tvmaze.com/seasons/${season.id}/episodes`);
            const episodes = episodesResponse.data;
            return {
                ...season,
                episodes
            };
        }));

        // Return the seasons with episode data
        res.json(seasonsWithEpisodes);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('TV show not found on TVMaze.');
        }
        res.status(500).send(error.message);
    }
});

// GET /api/tvshows/:id/runtime
// Calculate and fetch total runtime for a specific TV show
router.get('/:id/runtime', async (req, res) => {
    try {
        const tvShowId = req.params.id;
        
        // Fetch all seasons for the given TV show ID from TVMaze API
        const seasonsResponse = await axios.get(`https://api.tvmaze.com/shows/${tvShowId}/seasons`);
        const seasons = seasonsResponse.data;

        let runtime = 0;

        // For each season, fetch episodes and calculate total runtime
        for (const season of seasons) {
            const episodesResponse = await axios.get(`https://api.tvmaze.com/seasons/${season.id}/episodes`);
            const episodes = episodesResponse.data;
            episodes.forEach(episode => {
                runtime += episode.runtime || 0;
            });
        }

        // Return the total runtime
        res.json({ runtime });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('TV show not found on TVMaze.');
        }
        res.status(500).send(error.message);
    }
});

// GET /api/tvshows
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const sortBy = req.query.sortBy || 'premiered';
    const order = req.query.order === 'desc' ? -1 : 1;
    const genre = req.query.genre;
    const status = req.query.status;

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    // Build the query
    let query = {};
    if (genre) {
        query.genres = { $in: [genre] }; // Match any of the genres
    }
    if (status) {
        query.status = status;
    }

    try {
        const tvShows = await TVShow.find(query)
                                    .skip(skip)
                                    .limit(pageSize)
                                    .sort({ [sortBy]: order });
        const totalItemCount = await TVShow.countDocuments(query);
        const totalPages = Math.ceil(totalItemCount / pageSize);

        res.set('X-Page-Number', page.toString());
        res.set('X-Page-Size', pageSize.toString());
        res.set('X-Total-Item-Count', totalItemCount.toString());
        res.set('X-Total-Pages', totalPages.toString());

        res.json(tvShows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;