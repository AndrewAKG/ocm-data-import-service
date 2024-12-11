import { AnyBulkWriteOperation, Model, MongooseBulkWriteOptions } from 'mongoose';

export const upsertOneBulkOperation = <T extends { _id: any }>(doc: T) => ({
  updateOne: {
    filter: { _id: doc._id },
    update: { $set: doc },
    upsert: true
  }
});

export const insertOneBulkOperation = <T>(doc: T) => ({
  insertOne: { document: doc }
});

export const updateOneBulkOperation = <T extends { _id: any }>(doc: T) => ({
  updateOne: {
    filter: { _id: doc._id },
    update: { $set: doc }
  }
});

export const deleteOneBulkOperation = <T extends { _id: any }>(doc: T) => ({
  deleteOne: { filter: { _id: doc._id } }
});

export const bulkWrite = async <T>(
  model: Model<T>,
  operations: AnyBulkWriteOperation[],
  options?: MongooseBulkWriteOptions
): Promise<void> => {
  if (!operations || operations.length === 0) return;

  await model.bulkWrite(operations, options);
  console.log(`operations done for ${model.modelName} model`);
};
