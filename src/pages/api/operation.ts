import type { NextApiRequest, NextApiResponse } from "next";
import ClusterManager from "@/dataAccessLayer/clusterManager";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const operationsList = [
    {
        database: "testDB",
        collection: "testCollection",
        name: "findOne",
        query: { name: "testDocument" },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "findMany",
        query: { name: "testDocument" },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "insertOne",
        document: { name: "testDocument" },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "insertMany",
        document: [
            { name1: "testDocument1" },
            { name2: "testDocument2" },
            { name3: "testDocument3" },
        ],
    },
]


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (process.env.CLUSTER_0) {
            const clusterManager = new ClusterManager(process.env.CLUSTER_0, {
                OperationsList: operationsList,
            });

            await clusterManager.performOperations();
            res.status(200).json({ message: "Operation performed successfully, probably!" })
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}