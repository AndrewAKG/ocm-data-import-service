import { SupplyType } from '@common/types/connection';
import mongoose, { Schema, Document } from 'mongoose';

type SupplyTypeDocument = SupplyType & Document;

const SupplyTypeSchema: Schema = new Schema<SupplyTypeDocument>({
  _id: Number,
  Title: { type: String, required: true }
});

export const SupplyTypeModel = mongoose.model<SupplyTypeDocument>('SupplyType', SupplyTypeSchema);
