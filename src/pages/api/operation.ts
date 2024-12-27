import type { NextApiRequest, NextApiResponse } from "next";
import ClusterManager from "@/dataAccessLayer/clusterManager";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const operationsList = [
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
            { name: "testDocument1", foo: "bar" },
            { name: "testDocument2", foo: "bar" },
            { name: "testDocument3", foo: "bar" },
        ],
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "findOne",
        filter: { name: "testDocument" },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "findMany",
        filter: { foo: "bar" },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "updateOne",
        filter: { name: "testDocument" },
        document: { $set: { name: "updatedTestDocument" } },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "updateMany",
        filter: { name: { $exists: true } },
        document: { $set: { updated: true } },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "deleteOne",
        filter: { updated: true },
    },
    {
        database: "testDB",
        collection: "testCollection",
        name: "deleteMany",
        filter: { $or: [
            { name: "testDocument1" },
            { name: "testDocument2" },
            { name: "testDocument3" }
        ] },
    },    
]


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (process.env.CLUSTER_0) {
            const clusterManager = new ClusterManager(process.env.CLUSTER_0, {
                OperationsList: operationsList,
            });

            const result = await clusterManager.performOperations();
            res.status(200).json({
                message: "Operation performed successfully, probably!",
                result: result,
            })
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}