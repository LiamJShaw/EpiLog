import { json } from '@sveltejs/kit';

import { films } from '$lib/db/films';
import { maxPageSize } from '$lib/config';

export const GET = async ({ url }) => {
    let page = parseInt(url.searchParams.get('page') || '1', 10);
    let pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    const query = url.searchParams.get('query');
    const genre = url.searchParams.get('genre');
    const status = url.searchParams.get('status');

    const releaseDateGte = url.searchParams.get('releaseDateGte');
    const releaseDateLte = url.searchParams.get('releaseDateLte');
    
    const sortBy = url.searchParams.get('sortBy') || 'releaseDate';
    const order = url.searchParams.get('order') === 'asc' ? 1 : -1;

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    const searchOptions = {};

    if (query) {
        searchOptions.title = { $regex: new RegExp(query, 'i') };
    }

    if (genre) {
        searchOptions.genres = { $regex: new RegExp(genre, 'i') };
    }

    if (status) {
        searchOptions.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (releaseDateGte) {
        searchOptions.releaseDate = { $gte: new Date(releaseDateGte) };
    }

    if (releaseDateLte) {
        if (searchOptions.releaseDate) {
            searchOptions.releaseDate.$lte = new Date(releaseDateLte);
        } else {
            searchOptions.releaseDate = { $lte: new Date(releaseDateLte) };
        }
    }

    try {
        const data = await films.find(searchOptions)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: order })
            .toArray();

        const totalItemCount = await films.countDocuments(searchOptions);
        const totalPages = Math.ceil(totalItemCount / pageSize);

        const headers = {
            'X-Page-Number': page.toString(),
            'X-Page-Size': pageSize.toString(),
            'X-Total-Item-Count': totalItemCount.toString(),
            'X-Total-Pages': totalPages.toString()
        };

        return json(data, { headers });

    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
};
