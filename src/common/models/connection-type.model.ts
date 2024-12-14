import { ConnectionType } from '@common/types/connection';
import { DocumentId } from '@common/types/mongo';
import mongoose, { Schema } from 'mongoose';

export type ConnectionTypeDocument = ConnectionType & DocumentId;

export const ConnectionTypeSchema: Schema = new Schema<ConnectionTypeDocument>(
  {
    _id: Number,
    Title: { type: String, required: true },
    FormalName: { type: String, required: true },
    IsDiscontinued: { type: Boolean, required: true },
    IsObsolete: { type: Boolean, required: true }
  },
  { collection: 'connection_types' }
);

export const ConnectionTypeModel = mongoose.model<ConnectionTypeDocument>('ConnectionType', ConnectionTypeSchema);
