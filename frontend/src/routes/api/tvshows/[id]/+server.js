import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

import { tvShows } from '$lib/db/tvShows';

export const GET = async ({ params }) => {
    const { id } = params;

    try {
        const tvShow = await tvShows.findOne({ _id: new ObjectId(id) });
        if (!tvShow) {
            return new Response('TV show not found.', { status: 404 });
        }

        return json(tvShow);

    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
};