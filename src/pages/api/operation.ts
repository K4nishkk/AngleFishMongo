import type { NextApiRequest, NextApiResponse } from "next";
import ClusterManager from "@/dataAccessLayer/clusterManager";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        if (process.env.CLUSTER_0) {
            const clusterManager = new ClusterManager(process.env.CLUSTER_0, {
                Operations: [
                    {
                        database: "testDB",
                        collection: "testCollection",
                        operation: "insertOne",
                        document: {
                            name: "testDocument",
                        }
                    },
                    {
                        database: "testDB2",
                        collection: "testCollection2",
                        operation: "insertOne",
                        document: {
                            name: "testDocument2",
                        }
                    }
                ]
            });

            await clusterManager.performOperations();
            res.status(200).json({ message: "Operation performed successfully, probably!" })
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}