import { ConnectionType } from '@common/types/connection';
import mongoose, { Schema, Document } from 'mongoose';

type ConnectionTypeDocument = ConnectionType & Document;

const ConnectionTypeSchema: Schema = new Schema<ConnectionTypeDocument>({
  _id: Number,
  Title: { type: String, required: true },
  FormalName: { type: String, required: true },
  IsDiscontinued: { type: Boolean, required: true },
  IsObsolete: { type: Boolean, required: true }
});

export const ConnectionTypeModel = mongoose.model<ConnectionTypeDocument>('ConnectionType', ConnectionTypeSchema);
