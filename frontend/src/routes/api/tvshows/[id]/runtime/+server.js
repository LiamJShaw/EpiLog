import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

import { tvShows } from '$lib/db/tvShows';

export async function GET({ params }) {
    try {
        const { id } = params;
        const tvShow = await tvShows.findOne({ _id: new ObjectId(id) });

        if (!tvShow) {
            return new Response('TV show not found.', { status: 404 });
        }

        const seasonsResponse = await fetch(`https://api.tvmaze.com/shows/${tvShow.tvMazeId}/seasons`);

        if (!seasonsResponse.ok) throw new Error('Failed to fetch seasons');

        const seasons = await seasonsResponse.json();

        let runtime = 0;

        for (const season of seasons) {
            const episodesResponse = await fetch(`https://api.tvmaze.com/seasons/${season.id}/episodes`);

            if (!episodesResponse.ok) throw new Error(`Failed to fetch episodes for season ${season.id}`);

            const episodes = await episodesResponse.json();

            episodes.forEach(episode => {
                runtime += episode.runtime || 0;
            });
        }

        return json({ runtime });

    } catch (error) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
}