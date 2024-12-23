import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { MongoClient, ServerApiVersion, GridFSBucket, Db } from "mongodb";

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
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
        const form = formidable({
            uploadDir: "./public/uploads",
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

        await fs.promises.rename(file.filepath, `public/uploads/${originalFilename}`);

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

        fs.createReadStream(`public/uploads/${originalFilename}`).
            pipe(bucket.openUploadStream(originalFilename)).
            on('error', function (error) {
                console.log(error)
            }).
            on('finish', function () {
                console.log('done!');
                client.close();
            });

        res.status(200).json({
            message: "File uploaded successfully",
            filePath: `/uploads/${file.originalFilename}`,
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while uploading file" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
