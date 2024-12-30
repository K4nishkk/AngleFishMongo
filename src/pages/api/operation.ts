import type { NextApiRequest, NextApiResponse } from "next";
import ClusterManager from "@/layerDataAccess/clusterManager";
import logger from "@/lib/logger";
import { ObjectId } from "mongodb"

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const operationsList = [
    // {
    //     database: "FILE_SYSTEM",
    //     collection: "DIRECTORIES",
    //     name: "insertOne",
    //     document: {
    //         name: "Root",
    //         type: "Folder",
    //         parentId: null,
    //         children: [],
    //         createdAt: new Date(),
    //         updatedAT: new Date()
    //     },
    // },
    // {
    //     database: "FILE_SYSTEM",
    //     collection: "DIRECTORIES",
    //     name: "insertMany",
    //     document: [
    //         {
    //             name: "Projects",
    //             type: "Folder",
    //             parentId: new ObjectId("67720d672740d567fe9f843b"),
    //             children: [],
    //             createdAt: new Date(),
    //             updatedAT: new Date()
    //         },
    //         {
    //             name: "Personal",
    //             type: "Folder",
    //             parentId: new ObjectId("67720d672740d567fe9f843b"),
    //             children: [],
    //             createdAt: new Date(),
    //             updatedAT: new Date()
    //         },
    //         {
    //             name: "Pictures",
    //             type: "Folder",
    //             parentId: new ObjectId("67720d672740d567fe9f843b"),
    //             children: [],
    //             createdAt: new Date(),
    //             updatedAT: new Date()
    //         },
    //     ]
    // },
    {
        database: "FILE_SYSTEM",
        collection: "DIRECTORIES",
        name: "insertMany",
        document: [
            {
                name: "Videos",
                type: "Folder",
                parentId: new ObjectId("677215b52740d567fe9f8440"),
                children: [],
                createdAt: new Date(),
                updatedAT: new Date()
            },
            {
                name: "Vlogs",
                type: "Folder",
                parentId: new ObjectId("677215b52740d567fe9f8440"),
                children: [],
                createdAt: new Date(),
                updatedAT: new Date()
            },
            {
                name: "Vines",
                type: "Folder",
                parentId: new ObjectId("677215b52740d567fe9f8441"),
                children: [],
                createdAt: new Date(),
                updatedAT: new Date()
            },
            {
                name: "Dragon",
                type: "File",
                parentId: new ObjectId("677215b52740d567fe9f8441"),
                storageLocation: {
                    "blockId": "BLOCK_ 1",
                    "fileId": new ObjectId("64fae5cd9b2e4c0028b2a051"),
                },
                createdAt: new Date(),
                updatedAT: new Date()
            },
        ]
    },
]

// const operationsList = [
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "insertOne",
//         document: { name: "testDocument" },
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "insertMany",
//         document: [
//             { name: "testDocument1", foo: "bar" },
//             { name: "testDocument2", foo: "bar" },
//             { name: "testDocument3", foo: "bar" },
//         ],
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "findOne",
//         filter: { name: "testDocument" },
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "findMany",
//         filter: { foo: "bar" },
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "updateOne",
//         filter: { name: "testDocument" },
//         document: { $set: { name: "updatedTestDocument" } },
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "updateMany",
//         filter: { name: { $exists: true } },
//         document: { $set: { updated: true } },
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "deleteOne",
//         filter: { updated: true },
//     },
//     {
//         database: "testDB",
//         collection: "testCollection",
//         name: "deleteMany",
//         filter: {
//             $or: [
//                 { name: "testDocument1" },
//                 { name: "testDocument2" },
//                 { name: "testDocument3" }
//             ]
//         },
//     },
// ]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            if (process.env.CLUSTER_0) {
                const clusterManager = new ClusterManager(process.env.CLUSTER_0, {
                    OperationsList: operationsList,
                });

                const result = await clusterManager.performOperations();
                res.status(200).json({
                    message: "All operations performed successfully",
                    result: result,
                })
            }
        }
        catch (error: any) {
            logger.error(`API Handler Error: ${error.message}`, { stack: error.stack });
            res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}