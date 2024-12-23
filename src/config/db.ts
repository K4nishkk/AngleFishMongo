import { MongoClient, Db, GridFSBucket, ServerApiVersion } from 'mongodb';

export async function getBucket(): Promise<{ client: MongoClient, bucket: GridFSBucket }> {
  const uri = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri, {
      serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
      }
  });

  try {
      await client.connect();
      const database: Db = client.db("testDB");
      const bucket = new GridFSBucket(database, {
          chunkSizeBytes: 1024 * 255,
          bucketName: 'testBucket'
      });

      return { client, bucket };
  } catch (error) {
      client.close();
      throw new Error(`Error connecting to MongoDB: ${error}`);
  }
}