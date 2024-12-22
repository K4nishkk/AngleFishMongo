// src/pages/api/file.ts
import { getFile } from '../../services/fileOperations';
import type { NextApiRequest, NextApiResponse } from 'next';

const getFileRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileId } = req.query;

  try {
    const fileBuffer = await getFile(fileId as string); // Fetch file from GridFS
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileId}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error fetching file:', error);
    return res.status(500).json({ error: 'File retrieval failed' });
  }
};

export default getFileRoute;