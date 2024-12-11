import { UsageType } from '@common/types/poi';
import mongoose, { Schema, Document } from 'mongoose';

type UsageTypeDocument = UsageType & Document;

export const UsageTypeSchema: Schema<UsageTypeDocument> = new Schema<UsageTypeDocument>({
  _id: Number,
  Title: { type: String, required: true },
  IsPayAtLocation: { type: Boolean, required: true },
  IsMembershipRequired: { type: Boolean, required: true },
  IsAccessKeyRequired: { type: Boolean, required: true }
});

export const UsageTypeModel = mongoose.model<UsageTypeDocument>('UsageType', UsageTypeSchema);
