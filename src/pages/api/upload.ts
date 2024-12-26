import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion, GridFSBucket, Db } from "mongodb";
import path from "path";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        try {
            const uri = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
            console.log("meow")
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

            const filePath = path.join(process.cwd(), "public", "testImage.jpg");
            const fileStream = fs.createReadStream(filePath);

            fileStream
                .pipe(bucket.openUploadStream("testFilename"))
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
            })
        }
        catch (err) {
            console.error("Error", err);
            res.status(500).json({ error: err });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}