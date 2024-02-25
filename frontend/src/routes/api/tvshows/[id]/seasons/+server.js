import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb'; 

import { tvShows } from '$lib/db/tvShows';

export const GET = async ({ params }) => {
    try {
        const id = params.id;
        const tvShow = await tvShows.findOne({ _id: new ObjectId(id) });

        if (!tvShow) {
            return json({ error: 'TV show not found.' }, { status: 404 });
        }

        const seasonsResponse = await fetch(`https://api.tvmaze.com/shows/${tvShow.tvMazeId}/seasons`);

        if (!seasonsResponse.ok) {
            throw new Error('Failed to fetch seasons');
        }

        const seasons = await seasonsResponse.json();

        const seasonsWithEpisodes = await Promise.all(seasons.map(async (season) => {
            const episodesResponse = await fetch(`https://api.tvmaze.com/seasons/${season.id}/episodes`);

            if (!episodesResponse.ok) {
                throw new Error(`Failed to fetch episodes for season ${season.id}`);
            }

            const episodes = await episodesResponse.json();
            return {
                ...season,
                episodes
            };
        }));

        return json(seasonsWithEpisodes);

    } catch (error) {
        console.error(error);
        return json({ error: error.message }, { status: 500 });
    }
};