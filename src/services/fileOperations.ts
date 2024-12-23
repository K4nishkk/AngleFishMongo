import formidable from 'formidable';
import { Readable } from 'stream';
import { getBucket } from '@/config/db';

export async function createFile(file: formidable.File, originalFilename: string): Promise<string> {
    const { client, bucket } = await getBucket();

    const fileStream = Readable.from(file.filepath);

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(originalFilename);

        fileStream.pipe(uploadStream)
            .on('error', function (error) {
                client.close();
                reject(new Error(`Error while uploading file to Atlas: ${error}`));
            })
            .on('finish', function () {
                console.log('File successfully uploaded to Atlas');
                client.close();
                resolve(uploadStream.id.toHexString());
            });
    });
}

export async function retrieveFile(fileName: string): Promise<Readable> {
    const {client, bucket }= await getBucket();
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    return new Promise((resolve, reject) => {
        downloadStream
            .on('error', (error) => {
                reject(new Error(`Error while downloading file: ${error}`));
            })
            .on('data', () => {
                resolve(downloadStream);
            })
            .on('finish', () => {
                console.log("finish event is present")
                client.close();
            });
    });
}