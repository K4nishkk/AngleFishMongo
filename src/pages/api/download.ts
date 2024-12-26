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

        try {
            await client.connect();
            const database: Db = client.db("testDB");
            const bucket = new GridFSBucket(database, {
                chunkSizeBytes: 1024 * 255,
                bucketName: 'testBucket'
            });

            const downloadStream = bucket.openDownloadStreamByName("testFilename");

            // Set headers for file download
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader("Content-Disposition", 'attachment; filename="testImage.jpg"');

            downloadStream.on("data", (chunk) => {
                res.write(chunk);
            });

            downloadStream.on("end", () => {
                res.end();
                client.close();
            });

            downloadStream.on("error", (err) => {
                console.error("Error during file download:", err);
                res.status(500).json({ error: "Error downloading file" });
                client.close();
            });
        }
        catch (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}