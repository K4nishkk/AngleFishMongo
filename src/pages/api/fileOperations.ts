import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ServerApiVersion, GridFSBucket, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';

const uri = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    if (req.method === 'POST') {
        try {
            // Establish connection first
            await client.connect();

            // Once connected, get the database and initialize GridFSBucket
            const database: Db = client.db("Test");  // Your database name
            const bucket = new GridFSBucket(database, {
                chunkSizeBytes: 1024, // Choose chunk size to optimize
                bucketName: 'img'
            });

            // Path to the file you want to upload (in this case, 'README.md')
            const filePath = path.join(process.cwd(), 'README.md'); // Adjust path if needed

            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                res.status(400).json({ error: 'File not found' });
                return;
            }

            // Create a read stream and upload to GridFS
            const uploadStream = bucket.openUploadStream('meow'); // 'meow' is the filename stored in MongoDB
            const fileStream = fs.createReadStream(filePath);

            fileStream.pipe(uploadStream);

            // Ensure that the response is sent after the file upload finishes
            uploadStream.on('finish', () => {
                res.status(200).json({ message: 'File uploaded successfully' });
            });

            // Handle any errors during the upload
            uploadStream.on('error', (error) => {
                console.error('Upload error:', error);
                res.status(500).json({ error: 'Error uploading file', details: error.message });
            });

            // End the file stream once the upload finishes
            fileStream.on('end', () => {
                uploadStream.end();
            });

        } catch (error) {
            console.error('MongoDB error:', error);
            res.status(500).json({ error: 'Error uploading file' });
        } finally {
            // Always close the client after the operation
            await client.close();
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
