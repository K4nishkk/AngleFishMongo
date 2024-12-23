import type { NextApiRequest, NextApiResponse } from 'next';
import { retrieveFile } from '@/services/fileOperations';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { fileName } = req.query;

        if (!fileName || typeof fileName !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing file name' });
        }

        try {
            // Set headers for file download
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            // Retrieve the file stream
            const downloadStream = await retrieveFile(fileName);
            if (!downloadStream) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Pipe the download stream to the response
            downloadStream.pipe(res);

            // Handle stream events
            downloadStream.on('end', () => {
                console.log(`Download of file ${fileName} completed`);
            });

            downloadStream.on('error', (err) => {
                console.error(`Error downloading file ${fileName}: ${err}`);
                res.status(500).json({ error: 'Error while downloading file' });
            });
        } catch (error) {
            console.error(`Error handling file download: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
