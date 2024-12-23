import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method == 'POST') {
        console.log("update endpoint hit");
        res.status(200).json({ message: 'File created' });
    }
}