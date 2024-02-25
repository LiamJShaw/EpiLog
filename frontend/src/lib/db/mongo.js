import { MongoClient } from 'mongodb';

const connectionString = import.meta.env.VITE_MONGO_URL;

const url = connectionString;
const client = new MongoClient(url);

export { client };

export async function startMongo() {
  console.log('Connecting to MongoDB...');
  await client.connect();
  console.log('Successfully connected to MongoDB.');
}