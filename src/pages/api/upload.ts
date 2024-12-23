import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { MongoClient, ServerApiVersion, GridFSBucket, Db, ObjectId } from "mongodb";
import { Readable } from 'stream';
import { createFile } from '@/services/fileOperations';

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

            createFile(file, originalFilename);

            res.status(200).json({
                message: "File uploaded successfully to MongoDB",
            });
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