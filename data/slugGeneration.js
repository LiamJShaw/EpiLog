require('dotenv').config();

const mongoose = require('mongoose');
const slugify = require('slugify');

const TVShow = require('../src/models/tvShow');

mongoose.connect(process.env.MONGODB_URI);

const addSlugsToTVShows = async () => {
    const tvShows = await TVShow.find({ slug: { $exists: false } });

    for (const tvShow of tvShows) {
        const slug = slugify(tvShow.name, { lower: true, strict: true });
        tvShow.slug = slug;

        await tvShow.save();
        console.log(`Updated TV show: ${tvShow.name} with slug: ${tvShow.slug}`);
    }

    console.log('Finished adding slugs to TV shows.');
    mongoose.connection.close();
};

const addSlugsToFilms = async () => {
    const films = await Film.find({ slug: { $exists: false } }); // Find films without a slug

    for (const film of films) {
        const slug = slugify(film.title, { lower: true, strict: true });
        film.slug = slug;
        await film.save(); // Save the film document with the new slug
        console.log(`Updated film: ${film.title} with slug: ${film.slug}`);
    }

    console.log('Finished adding slugs to films.');
    mongoose.connection.close();
};

addSlugsToTVShows();
addSlugsToFilms();