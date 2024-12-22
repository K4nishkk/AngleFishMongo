import { MongoClient, Db, GridFSBucket } from 'mongodb';

const uri: string = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // The Mongo URI string
const dbName: string = "testDB"; // The database name

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connect(): Promise<{ client: MongoClient; db: Db }> {
  if (client) return { client, db: db! }; // Return existing client if already connected

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return { client, db: db! };
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Function to get GridFSBucket for file operations
export async function getBucket(): Promise<GridFSBucket> {
  const { db } = await connect();
  return new GridFSBucket(db, {
    bucketName: "TestBucket", // Bucket name for file storage
    chunkSizeBytes: 1024 * 255, // Set chunk size (default 255 KB)
  });
}