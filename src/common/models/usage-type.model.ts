import { DocumentId } from '@common/types/mongo';
import { UsageType } from '@common/types/poi';
import mongoose, { Schema } from 'mongoose';

export type UsageTypeDocument = Omit<UsageType, 'ID'> & DocumentId;

export const UsageTypeSchema: Schema<UsageTypeDocument> = new Schema<UsageTypeDocument>(
  {
    _id: Number,
    Title: { type: String, required: true },
    IsPayAtLocation: { type: Boolean, required: true },
    IsMembershipRequired: { type: Boolean, required: true },
    IsAccessKeyRequired: { type: Boolean, required: true }
  },
  { collection: 'usage_types' }
);

export const UsageTypeModel = mongoose.model<UsageTypeDocument>('UsageType', UsageTypeSchema);
