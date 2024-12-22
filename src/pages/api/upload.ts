// // src/pages/api/upload.ts
// import { uploadFile } from '../../services/fileOperations';
// import fs from 'fs';
// import path from 'path';
// import type { NextApiRequest, NextApiResponse } from 'next';
// import formidable, { File } from 'formidable';

// export const config = {
//   api: {
//     bodyParser: false, // Disable Next.js default body parser
//   },
// };

// const upload = async (req: NextApiRequest, res: NextApiResponse) => {
//   const form = new formidable.IncomingForm();
//   form.uploadDir = path.join(process.cwd(), '/tmp');
//   form.keepExtensions = true;

//   form.parse(req, async (err, fields, files) => {
//     if (err) return res.status(500).json({ error: 'Error parsing file' });

//     const file = files.file as formidable.File; // Type the incoming file object
//     const filePath = file.filepath;
//     const fileName = file.originalFilename || 'unknown';

//     try {
//       const { fileId } = await uploadFile(filePath, fileName); // Call CRUD method
//       fs.unlinkSync(filePath); // Clean up temp file
//       return res.status(200).json({ message: 'File uploaded successfully', fileId });
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       return res.status(500).json({ error: 'File upload failed' });
//     }
//   });
// };

// export default upload;