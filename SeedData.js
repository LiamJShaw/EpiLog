require('dotenv').config();

const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb(process.env.TMDB_APIKEY)

const axios = require('axios');
const mongoose = require('mongoose');
const Film = require('./src/models/film');
const TVShow = require('./src/models/tvShow');

mongoose.connect(process.env.MONGODB_URI);

// TV Shows

async function fetchInitialTVData() {
    try {
        let page = 0; // Start from page 0 or the last page you've processed
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
  
      showsUpdated++;

      // Update show in database
      await TVShow.updateOne({ tvMazeId: show.tvMazeId }, { $set: updatedData });
    }

    console.log(showsUpdated, "shows updated")
  
    mongoose.connection.close();
  }

fetchInitialTVData() ;






// Films
async function fetchMoviesByYear(startYear, endYear) {
    try {
        for (let year = startYear; year >= endYear; year--) {
            let page = 1;
            let totalPages;
            let continueFetching = true;

            while (continueFetching) {
                try {
                    const response = await moviedb.discoverMovie({
                        primary_release_year: year,
                        with_original_language: 'en', // Fetch only English language movies
                        page: page,
                        include_adult: false
                    });

                    const movies = response.results;
                    totalPages = response.total_pages;

                    for (const movie of movies) {
                        const existingFilm = await Film.findOne({ tmdbId: movie.id });
                        if (!existingFilm) {
                            const newFilm = new Film({ tmdbId: movie.id, title: movie.title });
                            await newFilm.save();
                        }
                    }

                    if (page >= totalPages) {
                        continueFetching = false;
                    }
                    console.log("Page: ", page, "/", totalPages)
                    page++;
                } catch (error) {
                    if (error.response && error.response.status === 422) {
                        console.log(`Reached the end of available data for the year ${year}.`);
                        continueFetching = false;
                    } else {
                        throw error;
                    }
                }
            }
            console.log(`English movies from the year ${year} fetched and stored successfully`);
        }
    } catch (error) {
        console.error('Error fetching and storing movie data:', error);
    } finally {
        mongoose.connection.close();
    }
}

// const currentYear = new Date().getFullYear();
// fetchAndStoreMoviesByYear(currentYear, 1950);

