import { StatusType } from '@common/types/status-types';
import mongoose, { Schema, Document } from 'mongoose';

type StatusTypeDocument = StatusType & Document;

export const StatusTypeSchema: Schema = new Schema<StatusTypeDocument>({
  _id: { type: Number },
  Title: { type: String, required: true },
  IsOperational: { type: Boolean, required: true },
  IsUserSelectable: { type: Boolean, required: true }
});

export const StatusTypeModel = mongoose.model<StatusTypeDocument>('StatusType', StatusTypeSchema);
