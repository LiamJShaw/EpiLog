import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

import { tvShows } from '$lib/db/tvShows';

export const GET = async ({ params }) => {
    try {
        const id = params.id;

        const tvShow = await tvShows.findOne({ _id: new ObjectId(id) });

        if (!tvShow) {
            return { status: 404, body: 'TV show not found.' };
        }

        // Fetch all episodes for the given TV show ID from TVMaze API
        const response = await fetch(`https://api.tvmaze.com/shows/${tvShow.tvMazeId}/episodes`);

        if (!response.ok) {
            throw new Error('Failed to fetch episodes from TVMaze');
        }

        const episodes = await response.json();

        return json(episodes);

    } catch (error) {
        return { status: 500, body: error.message };
    }
};