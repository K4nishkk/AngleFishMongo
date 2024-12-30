import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion, GridFSBucket, Db } from "mongodb";
import path from "path";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
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
            });

            const filePath = path.join(process.cwd(), "public", "testImage.jpg");
            const fileStream = fs.createReadStream(filePath);

            const uploadStream = bucket.openUploadStream("testFilename")

            fileStream
                .pipe(uploadStream)
                .on('error', function (error) {
                    console.error(`Error while uploading file to Atlas: ${error}`);
                    res.status(500).json({ error: `Error while uploading file to Atlas: ${error}` });
                    client.close();
                })
                .on('finish', function () {
                    console.log('File successfully uploaded to Atlas');
                    res.status(200).json({
                        message: "File uploaded successfully",
                        fileId: uploadStream.id,
                    });
                    client.close();
                });

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