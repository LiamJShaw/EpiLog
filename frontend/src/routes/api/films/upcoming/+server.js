import { json } from '@sveltejs/kit';

import { films } from '$lib/db/films';
import { maxPageSize } from '$lib/config';

export const GET = async ({ url }) => {
    let page = parseInt(url.searchParams.get('page')) || 1;
    let pageSize = parseInt(url.searchParams.get('pageSize')) || maxPageSize;
    const today = new Date();

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    try {
        const upcomingFilms = await films.find({
            releaseDate: { $gt: today }
        }).sort({ releaseDate: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

        const totalItemCount = await films.countDocuments({
            releaseDate: { $gt: today }
        });
        const totalPages = Math.ceil(totalItemCount / pageSize);

        const headers = {
            'X-Page-Number': page.toString(),
            'X-Page-Size': pageSize.toString(),
            'X-Total-Item-Count': totalItemCount.toString(),
            'X-Total-Pages': totalPages.toString()
        };

        return json(upcomingFilms, { headers });
    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
};