// src/pages/api/update.ts
import { updateFile } from '../../services/fileOperations';
import type { NextApiRequest, NextApiResponse } from 'next';

const updateFileRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileId, newFilePath, newFileName } = req.body; // Incoming file ID, new file details

  try {
    await updateFile(fileId as string, newFilePath as string, newFileName as string); // Update file logic
    return res.status(200).json({ message: 'File updated successfully' });
  } catch (error) {
    console.error('Error updating file:', error);
    return res.status(500).json({ error: 'File update failed' });
  }
};

export default updateFileRoute;
