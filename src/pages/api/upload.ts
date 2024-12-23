// File: pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

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

        res.status(200).json({
            message: "File uploaded successfully",
            filePath: `/uploads/${file.newFilename}`,
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
