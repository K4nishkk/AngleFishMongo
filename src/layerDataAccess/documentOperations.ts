import { Filter, MongoClient, OptionalId } from "mongodb";
import type { OperationDetails } from "./clusterManager";
import logger from "../lib/logger";

const getCollection = (client: MongoClient, operation: OperationDetails) => {
    try {
        const collection = client.db(operation.database).collection(operation.collection);
        logger.debug(`Accessing collection ${operation.collection} in database ${operation.database}`);
        return collection;
    } catch (error) {
        logger.error("Error while accessing collection:", { error });
        throw error;
    }
};

export async function insertOneDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const doc = operation.document as OptionalId<Document>;
        const result = await collection.insertOne(doc, operation.options);
        
        logger.info(`Document inserted successfully with _id: ${result.insertedId}`);
        return result;
    } catch (error) {
        logger.error("Error during insertOne operation:", { operation, error });
        throw error;
    }
}

export async function insertManyDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const docs = operation.document as Array<OptionalId<Document>>;
        const result = await collection.insertMany(docs, operation.options);
        
        logger.info(`${result.insertedCount} documents were inserted`);
        return result;
    } catch (error) {
        logger.error("Error during insertMany operation:", { operation, error });
        throw error;
    }
}

export async function findOneDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const filter = operation.filter as Filter<any>;
        const result = await collection.findOne(filter);

        logger.info((result?._id) ? `Document found successfully with _id: ${result._id}` : "No match found");
        return result;
    } catch (error) {
        logger.error("Error during findOne operation:", { operation, error });
        throw error;
    }
}

export async function findManyDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const filter = operation.filter as Filter<any>;
        const cursor = collection.find(filter, operation.options);

        const results = [];
        for await (const doc of cursor) {
            results.push(doc);
        }

        logger.info(`${results.length} matches were found`);
        return results;
    } catch (error) {
        logger.error("Error during findMany operation:", { operation, error });
        throw error;
    }
}

export async function updateOneDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const filter = operation.filter as Filter<any>;
        const document = operation.document as Record<string, any>;
        const result = await collection.updateOne(filter, document, operation.options);
        
        logger.info((result.modifiedCount) ? "Document modified successfully" : "No document was modified");
        return result;
    } catch (error) {
        logger.error("Error during updateOne operation:", { operation, error });
        throw error;
    }
}

export async function updateManyDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const filter = operation.filter as Filter<any>;
        const document = operation.document as OptionalId<Document>;
        const result = await collection.updateMany(filter, document, operation.options);
        
        logger.info(`${result.modifiedCount} documents were updated`);
        return result;
    } catch (error) {
        logger.error("Error during updateMany operation:", { operation, error });
        throw error;
    }
}

export async function deleteOneDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const result = await collection.deleteOne(operation.filter, operation.options);
        
        logger.info((result.deletedCount) ? "Document deleted successfully" : "No document was deleted");
        return result;
    } catch (error) {
        logger.error("Error during deleteOne operation:", { operation, error });
        throw error;
    }
}

export async function deleteManyDoc(client: MongoClient, operation: OperationDetails) {
    try {
        const collection = getCollection(client, operation);
        const result = await collection.deleteMany(operation.filter, operation.options);
        
        logger.info(`${result.deletedCount} documents were deleted`);
        return result;
    } catch (error) {
        logger.error("Error during deleteMany operation:", { operation, error });
        throw error;
    }
}
