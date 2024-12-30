import logger from "@/lib/logger";
import { Collection, Db, MongoClient, ObjectId, ServerApiVersion } from "mongodb";

export default class Directory {
    public static async getRecords(folderId: ObjectId) {
        const uri = `mongodb+srv://${process.env.CLIENT_NAME}:${process.env.PASSWORD}@cluster0.${process.env.CLUSTER_0}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        let result = null;

        try {
            client.connect();
            logger.info("MongoDB client connected");

            const database: Db = client.db("FILE_SYSTEM");
            const collection: Collection = database.collection("DIRECTORIES");

            result = await collection.findOne({ _id: folderId});

            if (result && result.children) {
                const cursor = collection.find({ _id: { $in: result.children } });

                const children = [];
                for await (const record of cursor) {
                    children.push(record);
                }
                result.children = children;
            }
        }
        catch (err) {
            logger.error(err);
        }
        finally {
            client.close();
            logger.info("MongoDB connection closed");
            return result;
        }
    }
}