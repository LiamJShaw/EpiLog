import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

import { films } from '$lib/db/films';

export const GET = async ({ params }) => {
    try {
        const { id } = params;
        const film = await films.findOne({ _id: new ObjectId(id) });

        if (!film) {
            return new Response('Film not found.', { status: 404 });
        }

        return json(film);
    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
};