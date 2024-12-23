import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createFile } from '@/services/fileOperations';

export const config = {
    api: {
        bodyParser: false,
    }
}

type ResponseData = {
    message?: string;
    error?: string;
    fileId?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method === 'POST') {
        try {
            const form = formidable({ keepExtensions: true });
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

            const fileId: string = await createFile(file, originalFilename);

            res.status(200).json({
                message: "File uploaded successfully to MongoDB",
                fileId: fileId
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