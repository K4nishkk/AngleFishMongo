import { Filter, MongoClient, OptionalId } from "mongodb";
import type { OperationDetails } from "./clusterManager";

const getCollection = (client: MongoClient, operation: OperationDetails) => {
    return client.db(operation.database).collection(operation.collection);
}

export async function insertOneDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);

    const doc = operation.document;
    const result = await collection.insertOne(doc as OptionalId<Document>, operation.options);

    console.log(`Document inserted successfully with _id: ${result.insertedId}`);
}

export async function insertManyDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);

    const docs = operation.document;
    const result = await collection.insertMany(docs as Array<OptionalId<Document>>, operation.options);

    console.log(`${result.insertedCount} documents were inserted`);
}

export async function findOneDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);

    const query = operation.query;
    const result = await collection.findOne(query as Filter<any>);

    console.log(result);
}

export async function findManyDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);

    const query = operation.query || {};
    const cursor = collection.find(query as Filter<any>, operation.options);

    try {
        const results = [];
        for await (const doc of cursor) {
            results.push(doc);
        }
        console.log("Documents found:", results);
    } catch (err) {
        console.error("Error while fetching documents:", err);
    }
}
