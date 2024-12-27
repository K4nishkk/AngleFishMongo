import { Filter, MongoClient, OptionalId } from "mongodb";
import type { OperationDetails } from "./clusterManager";

const getCollection = (client: MongoClient, operation: OperationDetails) => {
    return client.db(operation.database).collection(operation.collection);
}

export async function insertOneDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const doc = operation.document as OptionalId<Document>;
    const result = await collection.insertOne(doc, operation.options);

    console.log(`Document inserted successfully with _id: ${result.insertedId}`);
    return result;
}

export async function insertManyDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const docs = operation.document as Array<OptionalId<Document>>;
    const result = await collection.insertMany(docs, operation.options);

    console.log(`${result.insertedCount} documents were inserted`);
    return result;
}

export async function findOneDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const filter = operation.filter as Filter<any>;
    const result = await collection.findOne(filter);

    console.log(result);
    return result;
}

export async function findManyDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const filter = operation.filter as Filter<any>;
    const cursor = collection.find(filter, operation.options);

    try {
        const results = [];
        for await (const doc of cursor) {
            results.push(doc);
        }
        console.log("Documents found:", results);
        return results;
    } catch (err) {
        console.error("Error while fetching documents:", err);
    }
}

export async function updateOneDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const filter = operation.filter as Filter<any>;
    const document = operation.document as Record<string, any>;

    const result = await collection.updateOne(filter, document, operation.options);

    console.log(result);
    return result;
}

export async function updateManyDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const filter = operation.filter as Filter<any>;
    const document = operation.document as OptionalId<Document>;

    const result = await collection.updateMany(filter, document, operation.options);

    console.log(result);
    return result;
}

export async function deleteOneDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const result = await collection.deleteOne(operation.filter, operation.options);

    console.log(result);
    return result;
}

export async function deleteManyDoc(client: MongoClient, operation: OperationDetails) {
    const collection = getCollection(client, operation);
    const result = await collection.deleteMany(operation.filter, operation.options);

    console.log(result);
    return result;
}