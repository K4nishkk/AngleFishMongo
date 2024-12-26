import { MongoClient, ServerApiVersion, Db, GridFSBucket } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const uri = "mongodb+srv://angelfishmongo:jZd1LGFMAZshy14B@cluster0.hjdsx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

            const downloadStream = bucket.openDownloadStreamByName("testFilename");

            downloadStream.pipe(fs.createWriteStream("./testImage.jpg"));
            res.status(200).json("File downloaded successfully");
    }
}