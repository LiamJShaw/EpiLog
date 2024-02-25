import { client } from './mongo';

export const tvShows  = client.db("epilog").collection("tvshows");
