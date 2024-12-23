import formidable from 'formidable';
import { MongoClient, Db, GridFSBucket, ServerApiVersion } from 'mongodb';
import { Readable } from 'stream';

export async function createFile(file: formidable.File, originalFilename: string) {
    const uri = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    const database: Db = client.db("testDB");
    const bucket = new GridFSBucket(database, {
        chunkSizeBytes: 1024 * 255,
        bucketName: 'testBucket'
    });

    const fileStream = Readable.from(file.filepath); // Vercel might not allow this, consider uploading from the client

    const uploadStream = bucket.openUploadStream(originalFilename);

    fileStream.pipe(uploadStream)
        .on('error', function (error) {
            throw new Error(`Error while uploading file to Atlas: ${error}`);
        })
        .on('finish', function () {
            console.log('File successfully uploaded to Atlas');
            client.close();
        });
}