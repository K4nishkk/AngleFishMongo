# Things required for CRUD operation
* uri string -> then a object client of class MongoClient will be constructed using this string and some other configurations
* db name
* bucket name and chuck size
* file path on device
* filename for storage on atlas

# Using GridFS, we can do the following things
* Create and delete GridFS bucket
* Upload, download, delete and rename files
* Retrieve file information

> Upload, download, delete working properly on commit "send download to client"

In MongoDB, operations on collections are central to interacting with the database. Here is a breakdown of the types of operations you can perform on collections in MongoDB Atlas (or any MongoDB deployment):

### 1. **Collection CRUD Operations**
CRUD stands for **Create, Read, Update, and Delete**. These are the core operations that you can perform on collections in MongoDB.

#### **Create Operations:**
- **Insert One Document**: Add a single document to a collection.
  ```javascript
  db.collection('myCollection').insertOne({ name: 'John', age: 30 });
  ```

- **Insert Many Documents**: Insert multiple documents in one go.
  ```javascript
  db.collection('myCollection').insertMany([{ name: 'Alice' }, { name: 'Bob' }]);
  ```

#### **Read Operations:**
- **Find One Document**: Retrieve a single document that matches a query.
  ```javascript
  db.collection('myCollection').findOne({ name: 'John' });
  ```

- **Find Many Documents**: Retrieve multiple documents matching a query.
  ```javascript
  db.collection('myCollection').find({ age: { $gte: 30 } });
  ```

- **Count Documents**: Count how many documents match a specific query.
  ```javascript
  db.collection('myCollection').countDocuments({ status: 'active' });
  ```

- **Aggregation**: Perform complex data processing, like grouping, filtering, and sorting using an aggregation pipeline.
  ```javascript
  db.collection('myCollection').aggregate([
    { $match: { age: { $gte: 30 } } },
    { $group: { _id: "$age", count: { $sum: 1 } } }
  ]);
  ```

#### **Update Operations:**
- **Update One Document**: Update a single document that matches the query.
  ```javascript
  db.collection('myCollection').updateOne({ name: 'John' }, { $set: { age: 31 } });
  ```

- **Update Many Documents**: Update multiple documents that match the query.
  ```javascript
  db.collection('myCollection').updateMany({ age: { $gte: 30 } }, { $set: { status: 'active' } });
  ```

- **Replace One Document**: Replace a document entirely with a new one.
  ```javascript
  db.collection('myCollection').replaceOne({ name: 'John' }, { name: 'John', age: 32 });
  ```

#### **Delete Operations:**
- **Delete One Document**: Remove a single document from a collection.
  ```javascript
  db.collection('myCollection').deleteOne({ name: 'John' });
  ```

- **Delete Many Documents**: Remove multiple documents from a collection.
  ```javascript
  db.collection('myCollection').deleteMany({ age: { $lt: 18 } });
  ```

---

### 2. **Index Operations**
Indexes improve query performance by creating data structures that allow for faster searching and sorting.

- **Create Index**: Create an index on one or more fields.
  ```javascript
  db.collection('myCollection').createIndex({ name: 1 }); // 1 for ascending, -1 for descending
  ```

- **Drop Index**: Remove an index from a collection.
  ```javascript
  db.collection('myCollection').dropIndex('index_name');
  ```

- **List Indexes**: List all indexes in a collection.
  ```javascript
  db.collection('myCollection').getIndexes();
  ```

---

### 3. **Metadata Operations**
These operations manage collection-level metadata, which are useful for managing collections, setting validation rules, etc.

- **Create Collection**: Create a new collection in the database.
  ```javascript
  db.createCollection('myCollection');
  ```

- **Drop Collection**: Remove a collection and all its data from the database.
  ```javascript
  db.collection('myCollection').drop();
  ```

- **Rename Collection**: Rename a collection.
  ```javascript
  db.collection('myCollection').renameCollection('newCollectionName');
  ```

- **List Collections**: List all collections in a database.
  ```javascript
  db.listCollections();
  ```

- **Set Collection Validation**: Enforce validation rules on a collection.
  ```javascript
  db.createCollection('myCollection', {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "age"],
        properties: {
          name: { bsonType: "string" },
          age: { bsonType: "int" }
        }
      }
    }
  });
  ```

- **Get Collection Stats**: Retrieve statistics for a collection (e.g., document count, storage size).
  ```javascript
  db.collection('myCollection').stats();
  ```

---

### 4. **Aggregation Framework Operations**
The aggregation framework in MongoDB provides advanced operations for processing data, including grouping, sorting, and filtering.

- **$match**: Filter the documents that match a specific condition.
  ```javascript
  db.collection('myCollection').aggregate([
    { $match: { age: { $gte: 30 } } }
  ]);
  ```

- **$group**: Group documents by a specific field and perform operations like sum, average, etc.
  ```javascript
  db.collection('myCollection').aggregate([
    { $group: { _id: "$age", total: { $sum: 1 } } }
  ]);
  ```

- **$sort**: Sort the documents based on a field.
  ```javascript
  db.collection('myCollection').aggregate([
    { $sort: { age: -1 } }
  ]);
  ```

- **$limit**: Limit the number of documents returned.
  ```javascript
  db.collection('myCollection').aggregate([
    { $limit: 5 }
  ]);
  ```

- **$project**: Reshape documents by including, excluding, or creating new fields.
  ```javascript
  db.collection('myCollection').aggregate([
    { $project: { name: 1, age: 1, _id: 0 } }
  ]);
  ```

---

### 5. **GridFS Operations (for storing large files)**
GridFS is used for storing and retrieving large files that don't fit in a single document.

- **Upload File**: Upload a file to a GridFS bucket.
  ```javascript
  const bucket = new GridFSBucket(db);
  const uploadStream = bucket.openUploadStream('file_name');
  fs.createReadStream('path_to_file').pipe(uploadStream);
  ```

- **Download File**: Download a file from a GridFS bucket.
  ```javascript
  const bucket = new GridFSBucket(db);
  const downloadStream = bucket.openDownloadStreamByName('file_name');
  downloadStream.pipe(res);
  ```

- **Delete File**: Delete a file from a GridFS bucket.
  ```javascript
  const bucket = new GridFSBucket(db);
  bucket.delete(fileId);
  ```

---

### 6. **Transactions (if using Replica Set or Sharded Clusters)**
Transactions allow you to perform multiple operations atomically.

- **Start a Transaction**: Begin a transaction.
  ```javascript
  const session = client.startSession();
  session.startTransaction();
  ```

- **Commit a Transaction**: Commit all operations within the transaction.
  ```javascript
  session.commitTransaction();
  ```

- **Abort a Transaction**: Abort the transaction and roll back operations.
  ```javascript
  session.abortTransaction();
  ```

---

### 7. **Change Streams**
Change Streams allow you to listen for real-time changes to documents in a collection.

- **Watch for Changes**: Set up a change stream to monitor a collection.
  ```javascript
  const changeStream = db.collection('myCollection').watch();
  changeStream.on('change', (change) => {
    console.log(change);
  });
  ```

---

### 8. **Other Operations**
- **Collation**: Perform case-insensitive or locale-specific queries.
  ```javascript
  db.collection('myCollection').find({ name: 'John' }).collation({ locale: 'en', strength: 2 });
  ```

- **MapReduce**: Perform map-reduce operations for data aggregation.
  ```javascript
  db.collection('myCollection').mapReduce(
    function() { emit(this.name, 1); },
    function(key, values) { return Array.sum(values); },
    { out: 'resultCollection' }
  );
  ```

---

### Summary of Common Collection Operations:
- **CRUD**: `insertOne()`, `insertMany()`, `find()`, `updateOne()`, `updateMany()`, `deleteOne()`, `deleteMany()`
- **Indexing**: `createIndex()`, `dropIndex()`, `getIndexes()`
- **Metadata**: `createCollection()`, `drop()`, `rename()`, `stats()`
- **Aggregation**: `$match`, `$group`, `$sort`, `$project`, `$limit`
- **GridFS**: `openUploadStream()`, `openDownloadStreamByName()`, `delete()`
- **Transactions**: `startTransaction()`, `commitTransaction()`, `abortTransaction()`
- **Change Streams**: `watch()`

These operations allow you to interact with and manage data within MongoDB collections efficiently.