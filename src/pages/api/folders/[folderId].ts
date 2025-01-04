import Directory from '@/layerDataAccess/directory';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import logger from '@/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { folderId } = req.query;
        const result = await Directory.getRecords(new ObjectId(folderId as string));

        if (!result) {
            logger.warn(`Did not find directory with id: ${folderId}`);
            res.status(404).json({ message: "Folder not found" });
        }
        
        logger.info(`Found directory with id: ${folderId}`);
        res.status(200).json( result );
    }
    catch (err: any) {
        logger.error(err.stack);
        res.status(400).json({ Error: err.message })
    }
}