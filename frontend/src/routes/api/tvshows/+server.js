import { json } from '@sveltejs/kit';

import { tvShows } from '$lib/db/tvShows';
import { maxPageSize } from '$lib/config';

export const GET = async ({ url }) => {
    let page = parseInt(url.searchParams.get('page') || '1', 10);
    let pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    const sortBy = url.searchParams.get('sortBy') || 'premiered';
    const order = url.searchParams.get('order') === 'asc' ? 1 : -1;

    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    try {
        const data = await tvShows.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: order })
            .toArray();

        const totalItemCount = await tvShows.countDocuments();
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