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

        try {
    
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
                try {
                    await bucket.delete(fileId);
                    console.log(`File with ID ${fileId} successfully deleted.`);
                    res.status(200).json({ message: `File successfully deleted with fileId ${fileId}`})
                } catch (err) {
                    console.error(`Error deleting file with ID ${fileId}:`, err);
                    res.status(500).json({ error: `Error deleting file with ID ${fileId}` });
                    return;
                }
            } else {
                console.error("File not found in the database.");
                res.status(404).json({ message: "File not found in the database." });
                return;
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err })
        }        
        finally {
            await client.close();
        }
    }
    else {
        res.status(405).json({ message: "method not allowed" })
    }
}