import { StatusType } from '@common/types/status-types';
import mongoose, { Schema, Document } from 'mongoose';

type StatusTypeDocument = StatusType & Document;

const StatusTypeSchema: Schema = new Schema<StatusTypeDocument>({
  IsOperational: { type: Boolean, required: true },
  IsUserSelectable: { type: Boolean, required: true },
  ID: { type: Number, required: true, unique: true },
  Title: { type: String, required: true }
});

export const StatusTypeModel = mongoose.model<StatusTypeDocument>('StatusType', StatusTypeSchema);
