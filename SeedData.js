require('dotenv').config();

const axios = require('axios');

const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb(process.env.TMDB_APIKEY)

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

// fetchInitialTVData();






// Films
let genreMap = {};

const fetchGenreMap = async () => {
    try {
        const response = await moviedb.genreMovieList({});
        response.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });
    } catch (error) {
        console.error('Error fetching genre list:', error);
    }
};

const fetchImageConfig = async () => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/configuration`, {
            params: { api_key: process.env.TMDB_APIKEY }
        });
        return response.data.images;
    } catch (error) {
        console.error('Error fetching image configuration:', error);
    }
};

const updateFilmDetails = async () => {
    const imageConfig = await fetchImageConfig();

    if (!imageConfig) {
        console.error('Failed to fetch image configuration.');
        return;
    }

    const films = await Film.find({});

    for (const film of films) {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${film.tmdbId}`, {
                params: { api_key: process.env.TMDB_APIKEY }
            });
            const details = response.data;

            const updatedFilm = {
                ...film.toObject(),
                backdropPath: imageConfig.base_url + imageConfig.backdrop_sizes[2] + details.backdrop_path,
                imdbId: details.imdb_id,
                originalLanguage: details.original_language,
                overview: details.overview,
                posterPath: imageConfig.base_url + imageConfig.poster_sizes[4] + details.poster_path,
                releaseDate: new Date(details.release_date),
                runtime: details.runtime,
                status: details.status,
                tagline: details.tagline,
            };

            console.log(updatedFilm);

            await Film.findByIdAndUpdate(film._id, updatedFilm);
            console.log(`Updated details for film: ${film.title}`);
        } catch (error) {
            console.error(`Error updating details for film: ${film.title}`, error);
        }
    }

    console.log('Finished updating film details.');
    mongoose.connection.close();
};

const fetchMoviesByYear = async (startYear, endYear) => {
    await fetchGenreMap();

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
                            let releaseDate = new Date(movie.release_date);
                    
                            // Check if the release date is invalid
                            if (isNaN(releaseDate.getTime())) {
                                // Try alternative date fields (if available)
                                releaseDate = new Date(movie.first_air_date) || new Date(movie.digital_release_date);
                                
                                // If it's still invalid, fetch detailed movie info
                                if (isNaN(releaseDate.getTime())) {
                                    const detailedInfo = await moviedb.movieInfo({ id: movie.id });
                                    releaseDate = new Date(detailedInfo.release_date);
                    
                                    // If the date is still invalid, consider it as an upcoming movie
                                    if (isNaN(releaseDate.getTime())) {
                                        releaseDate = null;
                                    }
                                }
                            }
                    
                            const newFilm = new Film({
                                tmdbId: movie.id,
                                title: movie.title,
                                genres: movie.genre_ids.map(id => genreMap[id]).filter(name => name), // Map genre IDs to names
                                releaseDate: releaseDate, // Storing release date
                                language: movie.original_language, // Storing language
                            });
                            await newFilm.save();
                        }
                    }                    

                    if (page >= totalPages) {
                        continueFetching = false;
                    }
                    console.log(`Year: ${year} - Page: ${page} of ${totalPages}`);
                    page++;
                } catch (error) {
                    if (error.response && error.response.status === 422) {
                        console.log(`Reached the end of available data for the year ${year}.`);
                        continueFetching = false;
                    } else {
                        console.error('Error fetching movie data:', error.message);
                        throw error;
                    }
                }
            }
            console.log(`Movies from the year ${year} fetched and stored successfully.`);
        }
    } catch (error) {
        console.error('Error in fetchMoviesByYear:', error);
    } finally {
        console.log('Closing database connection.');
        mongoose.connection.close();
    }
};


// Run this to get the intitial data into the database
// fetchMoviesByYear(2024, 1940);

// Run this to update with further info
updateFilmDetails();

// No updated timestamp in the films script. Whoops. Can fix it with:
// db.films.updateMany({}, { $set: { updated: new Date() } }); in mongosh
