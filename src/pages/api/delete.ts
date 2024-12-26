// leaves an empty bucket if the last file is deleted
import { MongoClient, ServerApiVersion, Db, GridFSBucket, GridFSFile } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    if (req.method === "DELETE") {
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

        const info: Array<GridFSFile> = [];

        const cursor = bucket.find({ filename: "testFilename"});
        for await (const doc of cursor) {
            console.log(doc)
            info.push(doc)
        }

        const fileId = info.at(0)?._id;

        console.log(fileId);

        if (fileId) {
            bucket.delete(fileId);
        }
        res.status(200).json({ message: "file successfully deleted.", fileData: info})
    }
}