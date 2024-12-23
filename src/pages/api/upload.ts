import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { MongoClient, ServerApiVersion, GridFSBucket, Db, ObjectId } from "mongodb";
import path from 'path';
import { Readable } from 'stream';

export const config = {
    api: {
        bodyParser: false,
    }
}

// Define response type
type ResponseData = {
    message?: string;
    filePath?: string;
    error?: string;
    fileId?: ObjectId;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'POST') {
        try {
            const form = formidable({
                keepExtensions: true,
            });

            const [fields, files] = await form.parse(req);

            const uploadedFile = files.file;

            if (!uploadedFile) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

            const originalFilename = file.originalFilename
            if (!originalFilename) {
                return res.status(400).json({ error: "File name missing" });
            }

            const uri = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

            // Create a MongoClient with a MongoClientOptions object to set the Stable API version
            const client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });

            const database: Db = client.db("testDB");
            const bucket = new GridFSBucket(database, {
                chunkSizeBytes: 1024 * 255,
                bucketName: 'testBucket'
            });

            const fileStream = Readable.from(file.filepath);

            fileStream
                .pipe(bucket.openUploadStream(originalFilename))
                .on('error', function (error) {
                    console.error(`Error while uploading file to Atlas: ${error}`);
                    res.status(500).json({ error: `Error while uploading file to Atlas: ${error}` });
                })
                .on('finish', function () {
                    console.log('File successfully uploaded to Atlas');
                    client.close();
                });

            res.status(200).json({
                message: "File uploaded successfully",
                filePath: `/uploads/${file.originalFilename}`,
            })
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: `Error while uploading file: ${error}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
