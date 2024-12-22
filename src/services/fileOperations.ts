import fs from 'fs';
import { GridFSBucket, ObjectId } from 'mongodb';
import { getBucket } from '../config/db';

interface FileUploadResult {
  fileId: string;
}

// Create: Upload file to GridFS
export async function uploadFile(filePath: string, fileName: string): Promise<FileUploadResult> {
  const bucket: GridFSBucket = await getBucket();
  const uploadStream = bucket.openUploadStream(fileName);
  const fileStream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    fileStream.pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve({ fileId: uploadStream.id.toString() }));
  });
}

// Read: Fetch file from GridFS by file ID or file name
export async function getFile(fileId: string): Promise<Buffer> {
  const bucket: GridFSBucket = await getBucket();
  const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    downloadStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
    downloadStream.on('error', reject);
  });
}

// Update: Replace file in GridFS
export async function updateFile(fileId: string, newFilePath: string, newFileName: string): Promise<FileUploadResult> {
  // Delete old file first
  await deleteFile(fileId);

  // Upload new file
  return uploadFile(newFilePath, newFileName);
}

// Delete: Remove file from GridFS by file ID
export async function deleteFile(fileId: string): Promise<void> {
  const bucket: GridFSBucket = await getBucket();
  return new Promise((resolve, reject) => {
    bucket.delete(new ObjectId(fileId));
  });
}