import { client } from './mongo';

export const films = client.db("epilog").collection("films");