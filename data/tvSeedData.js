require('dotenv').config();

const axios = require('axios');

const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb(process.env.TMDB_APIKEY)

const mongoose = require('mongoose');
const TVShow = require('../src/models/tvShow');

mongoose.connect(process.env.MONGODB_URI);

async function fetchInitialTVData() {
    try {
        let page = 0;
        let hasMoreData = true;

        while (hasMoreData) {
            const response = await axios.get(`https://api.tvmaze.com/shows?page=${page}`);
            const tvShows = response.data;

            if (tvShows.length === 0) {
                hasMoreData = false;
            } else {
                for (const show of tvShows) {
                    const showData = {
                        tvMazeId: show.id,
                        name: show.name,
                        genres: show.genres,
                        averageRuntime: show.averageRuntime || show.runtime,
                        premiered: new Date(show.premiered),
                        image: show.image ? show.image.medium : null,
                        status: show.status,
                        summary: show.summary,
                        language: show.language, 
                        updated: Date.now()
                    };

                    console.log(show.name, " updated")

                    // Update existing document or create a new one
                    await TVShow.findOneAndUpdate({ tvMazeId: show.id }, showData, { upsert: true });
                }

                console.log("Page: ", page);
                page++;
            }
        }

        console.log('TV data fetched and stored successfully');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('Reached the end of TV show data.');
        } else {
            console.error('Error fetching and storing TV data:', error);
        }
    }
}

async function updateTVShows() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const showsToUpdate = await TVShow.find({ updated: { $lt: oneWeekAgo } });

    let showsUpdated = 0;

    for (const show of showsToUpdate) {
        // Fetch updated data from TVMaze API
        const response = await axios.get(`https://api.tvmaze.com/shows/${show.tvMazeId}`);
        const updatedData = response.data;

        const update = {
            tvMazeId: updatedData.id,
            name: updatedData.name,
            genres: updatedData.genres,
            averageRuntime: updatedData.runtime,
            premiered: new Date(updatedData.premiered),
            image: updatedData.image ? updatedData.image.medium : null,
            status: updatedData.status,
            summary: updatedData.summary,
            language: updatedData.language,
            updated: Date.now(),
        };

        showsUpdated++;

        // Update show in database
        await TVShow.updateOne({ tvMazeId: show.tvMazeId }, { $set: update });
    }

    console.log(showsUpdated, "shows updated");

    mongoose.connection.close();
}


async function updateTVShowsLanguage() {
    const allShows = await TVShow.find({ language: { $exists: false } }); // Find shows without a language

    let showsUpdated = 0;

    for (const show of allShows) {
        try {
            // Fetch updated data from TVMaze API
            const response = await axios.get(`https://api.tvmaze.com/shows/${show.tvMazeId}`);
            const updatedData = response.data;

            // Extract the language and construct the update object
            const update = { language: updatedData.language };

            // Update the show in the database if language is provided
            if (update.language) {
                await TVShow.updateOne({ tvMazeId: show.tvMazeId }, { $set: update });
                showsUpdated++;
                console.log(`Updated show ${show.tvMazeId} with language: ${update.language}`);
            } else {
                console.log(`No language information available for show ${show.tvMazeId}`);
            }

            // Delay to avoid hitting the rate limit
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`Error updating language for show with ID ${show.tvMazeId}: ${error}`);
        }
    }

    console.log(`${showsUpdated} shows updated with language information`);

    mongoose.connection.close();
}

async function updateTVShowsIMDBId() {
    const allShows = await TVShow.find({ imdbId: { $exists: false } }); // Find shows without an IMDB ID

    let showsUpdated = 0;

    for (const show of allShows) {
        try {
            // Fetch updated data from TVMaze API
            const response = await axios.get(`https://api.tvmaze.com/shows/${show.tvMazeId}`);
            const updatedData = response.data;

            // Extract the IMDB ID
            const imdbId = updatedData.externals && updatedData.externals.imdb;

            // Update the show in the database if IMDB ID is available
            if (imdbId) {
                await TVShow.updateOne({ tvMazeId: show.tvMazeId }, { $set: { imdbId: imdbId } });
                showsUpdated++;
                console.log(`Successfully updated show ${show.tvMazeId} with IMDB ID: ${imdbId}`);
            } else {
                console.log(`No IMDB ID available for show ${show.tvMazeId}`);
            }

            // Delay to avoid hitting the rate limit
            // await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(`Error updating IMDB ID for show with ID ${show.tvMazeId}: ${error}`);
        }
    }

    console.log(`${showsUpdated} shows updated with IMDB ID information`);

    mongoose.connection.close();
}

// Get all the data you need to seed the database
// fetchInitialTVData();

// Update the data if it hasn't been updated in the last week
// updateTVShows();

// Add a field that doesn't exist already in the DB, ex: language
// updateTVShowsLanguage();
updateTVShowsIMDBId();