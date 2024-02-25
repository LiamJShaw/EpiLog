import { json } from '@sveltejs/kit';
import { tvShows } from '$lib/db/tvShows';
import { maxPageSize } from '$lib/config';

export const GET = async ({ url }) => {
    const query = url.searchParams.get('query');
    const genre = url.searchParams.get('genre');
    const status = url.searchParams.get('status');

    const premieredAfter = url.searchParams.get('premieredAfter');
    const premieredBefore = url.searchParams.get('premieredBefore');

    const sortBy = url.searchParams.get('sortBy') || 'premiered';
    const order = url.searchParams.get('order') === 'asc' ? 1 : -1;

    let page = parseInt(url.searchParams.get('page') || '1', 10);
    let pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

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
        // Running 
        // Ended
        // Upcoming
        // To Be Determined
        searchOptions.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (premieredAfter) {
        searchOptions.premiered = { $gte: new Date(premieredAfter) };
    }

    if (premieredBefore) {
        if (searchOptions.premiered) {
            searchOptions.premiered.$lte = new Date(premieredBefore);
        } else {
            searchOptions.premiered = { $lte: new Date(premieredBefore) };
        }
    }

    try {
        const data = await tvShows.find(searchOptions)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: order })
            .toArray();

        const totalItemCount = await tvShows.countDocuments(searchOptions);
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