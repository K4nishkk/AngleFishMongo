import type { NextApiRequest, NextApiResponse } from 'next';
import { getBucket } from '@/config/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { fileName } = req.query;

        if (!fileName || typeof fileName !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing file name' });
        }

        try {
            const { client, bucket } = await getBucket();

            const downloadStream = bucket.openDownloadStreamByName(fileName);

            // Set headers for file download
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            // Pipe the file stream directly to the response
            downloadStream
                .pipe(res)
                .on('error', (error) => {
                    console.error(`Error downloading file: ${error}`);
                    res.status(404).json({ error: 'File not found or download error' });
                })
                .on('close', () => {
                    client.close();
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
