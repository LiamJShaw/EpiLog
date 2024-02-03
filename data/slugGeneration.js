require('dotenv').config();

const mongoose = require('mongoose');
const slugify = require('slugify');

const TVShow = require('../src/models/tvShow');
const Film = require('../src/models/film');

mongoose.connect(process.env.MONGODB_URI);

const addSlugsToTVShows = async () => {
    const tvShows = await TVShow.find({ slug: { $exists: false } });

    for (const tvShow of tvShows) {
        const slug = slugify(tvShow.title, { lower: true, strict: true });
        tvShow.slug = slug;

        try {
            await tvShow.save();
            console.log(`Updated TV show: ${tvShow.title} with slug: ${tvShow.slug}`);
        } catch {
            console.log("TV show", tvShow.title, "failed to slug!");
            continue;
        }
    }

    console.log('Finished adding slugs to TV shows.');
    mongoose.connection.close();
};

const addSlugsToFilms = async () => {
    const films = await Film.find({ slug: { $exists: false } });

    for (const film of films) {
        const slug = slugify(film.title, { lower: true, strict: true });
        film.slug = slug;

        // await film.save();
        // console.log(`Updated film: ${film.title} with slug: ${film.slug}`);

        try {
            await film.save();
            console.log(`Updated film: ${film.title} with slug: ${film.slug}`);
        } catch {
            console.log("Film", film.title, "failed to slug!");
            continue;
        }
    }

    console.log('Finished adding slugs to films.');
    mongoose.connection.close();
};

// addSlugsToTVShows();
addSlugsToFilms();