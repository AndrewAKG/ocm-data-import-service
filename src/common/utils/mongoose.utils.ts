import { DocumentId } from '@common/types/mongo';
import { AnyBulkWriteOperation, Model, MongooseBulkWriteOptions } from 'mongoose';

export const upsertOneBulkOperation = <T extends DocumentId>(doc: T) => ({
  updateOne: {
    filter: { _id: doc._id },
    update: { $set: doc },
    upsert: true
  }
});

export const insertOneBulkOperation = <T>(doc: T) => ({
  insertOne: { document: doc }
});

export const updateOneBulkOperation = <T extends DocumentId>(doc: T) => ({
  updateOne: {
    filter: { _id: doc._id },
    update: { $set: doc }
  }
});

export const deleteOneBulkOperation = <T extends DocumentId>(doc: T) => ({
  deleteOne: { filter: { _id: doc._id } }
});

export const bulkWrite = async <T>(
  model: Model<T>,
  operations: AnyBulkWriteOperation[],
  options?: MongooseBulkWriteOptions
): Promise<void> => {
  if (!operations || operations.length === 0) {
    console.log('no operations found => returning');
    return;
  }

  await model.bulkWrite(operations, options);
  console.log(`${operations.length} operations done for ${model.modelName} model`);
};
