import { json } from '@sveltejs/kit';

import { films } from '$lib/db/films';
import { maxPageSize } from '$lib/config';

export const GET = async ({ url }) => {
    const sortBy = url.searchParams.get('sortBy') || 'releaseDate';
    const order = url.searchParams.get('order') === 'asc' ? 1 : -1;

    let page = parseInt(url.searchParams.get('page')) || 1;
    let pageSize = parseInt(url.searchParams.get('pageSize')) || maxPageSize;

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    try {
        const data = await films.find({})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: order })
            .toArray();

        const totalItemCount = await films.countDocuments({});
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
