// src/pages/api/delete.ts
import { deleteFile } from '../../services/fileOperations';
import type { NextApiRequest, NextApiResponse } from 'next';

const deleteFileRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileId } = req.body;

  try {
    await deleteFile(fileId as string); // Call CRUD method to delete file
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'File deletion failed' });
  }
};

export default deleteFileRoute;
