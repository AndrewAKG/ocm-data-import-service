import { DocumentId } from '@common/types/mongo';
import { StatusType } from '@common/types/status-types';
import mongoose, { Schema } from 'mongoose';

export type StatusTypeDocument = Omit<StatusType, 'ID'> & DocumentId;

export const StatusTypeSchema: Schema = new Schema<StatusTypeDocument>(
  {
    _id: { type: Number },
    Title: { type: String, required: true },
    IsOperational: { type: Boolean, required: true },
    IsUserSelectable: { type: Boolean, required: true }
  },
  { collection: 'status_types' }
);

export const StatusTypeModel = mongoose.model<StatusTypeDocument>('StatusType', StatusTypeSchema);
