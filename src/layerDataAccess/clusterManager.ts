import { MongoClient, ServerApiVersion } from "mongodb";
import * as documentOperations from "./documentOperations";
import logger from "@/lib/logger";
import { AppError } from "@/lib/errors";

export type OperationDetails = {
    database: string,
    bucket?: string,
    collection: string,
    name: string,
    document?: Object,
    filter?: Object,
    options?: Object,
}

export type OperationsData = {
    OperationsList: Array<OperationDetails>,
}

type Operation = (client: MongoClient, operationDetails: OperationDetails) => Promise<any>;

const operationMap = new Map<string, Operation>([
    ["insertOne", documentOperations.insertOneDoc],
    ["insertMany", documentOperations.insertManyDoc],
    ["findOne", documentOperations.findOneDoc],
    ["findMany", documentOperations.findManyDoc],
    ["updateOne", documentOperations.updateOneDoc],
    ["updateMany", documentOperations.updateManyDoc],
    ["deleteOne", documentOperations.deleteOneDoc],
    ["deleteMany", documentOperations.deleteManyDoc],
]);

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
        const results = [];
        try {
            await this.client.connect();
            logger.info("MongoDB client connected");

            for (const operation of this.operationDetails.OperationsList) {
                const execute = operationMap.get(operation.name);
                if (!execute) {
                    throw new AppError(`Operation "${operation.name}" not found`, 400);
                }

                const output = await execute(this.client, operation);
                results.push(output);
                logger.debug(`Operation "${operation.name}" completed successfully`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                logger.error(`Error in performOperations: ${error.message}`);
                console.log(error.stack);
                throw new AppError(`Operation failed: ${error.message}`, 500, false);
            }
            else {
                logger.error(`Unknown error type: ${JSON.stringify(error)}`);
                throw new AppError(`Operation failed: ${JSON.stringify(error)}`, 500, false);
            }
        }
        finally {
            this.client.close();
            logger.info("MongoDB client connection closed")
            return results;
        }
    }
}

export default ClusterManager;