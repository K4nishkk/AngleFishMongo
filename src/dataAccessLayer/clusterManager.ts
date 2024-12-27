import { MongoClient, ServerApiVersion } from "mongodb";

export type Operation = {
    database: string,
    bucket?: string,
    collection: string,
    operation: string,
    document: Object,
}

export type OperationDetails = {
    Operations: Array<Operation>,
}

class ClusterManager {
    private client: MongoClient;
    private operationDetails: OperationDetails;

    public constructor(cluster_id: string, operationDetails: OperationDetails) {
        const uri = `mongodb+srv://${process.env.CLIENT_NAME}:${process.env.PASSWORD}@cluster0.${cluster_id}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

        this.client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        this.operationDetails = operationDetails;
    }

    public async performOperations() {
        try {
            for (const operation of this.operationDetails.Operations) {
                const database = this.client.db(operation.database);
                const collection = database.collection(operation.collection);

                const doc = operation.document;
                const result = await collection.insertOne(doc);

                console.log(`Document inserted successfully with _id: ${result.insertedId}`);
            }
        }
        catch (err) {
            console.log("Error while performing operation: ", err);
        }
        finally {
            this.client.close();
        }
    }
}

export default ClusterManager;