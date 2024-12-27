import { MongoClient, ServerApiVersion } from "mongodb";
import { findManyDoc, findOneDoc, insertManyDoc, insertOneDoc } from "./documentOperations";

export type OperationDetails = {
    database: string,
    bucket?: string,
    collection: string,
    name: string,
    document?: Object,
    query?: Object,
    options?: Object,
}

export type OperationsData = {
    OperationsList: Array<OperationDetails>,
}

type Operation = (client: MongoClient, operationDetails: OperationDetails) => Promise<any>;

const operationMap = new Map<string, Operation>([
    ["insertOne", async (client: MongoClient, operationDetails: OperationDetails) => await insertOneDoc(client, operationDetails)],
    ["insertMany", async (client: MongoClient, operationDetails: OperationDetails) => await insertManyDoc(client, operationDetails)],
    ["findOne", async (client: MongoClient, operationDetails: OperationDetails) => await findOneDoc(client, operationDetails)],
    ["findMany", async (client: MongoClient, operationDetails: OperationDetails) => await findManyDoc(client, operationDetails)],
])

class ClusterManager {
    private client: MongoClient;
    private operationDetails: OperationsData;

    public constructor(cluster_id: string, operationDetails: OperationsData) {
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
            for (const operation of this.operationDetails.OperationsList) {
                const execute = operationMap.get(operation.name);
                if (execute) {
                    await execute(this.client, operation);
                }
                else {
                    console.log("Operation not found");
                }
            }
        }
        catch (err) {
            console.log("Error while performing operation: ", err);
            throw new Error(`Error while performaing operation: ${err}`);
        }
        finally {
            this.client.close();
        }
    }
}

export default ClusterManager;