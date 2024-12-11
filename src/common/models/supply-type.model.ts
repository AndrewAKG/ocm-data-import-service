import { SupplyType } from '@common/types/supply-type';
import mongoose, { Schema } from 'mongoose';

export type SupplyTypeDocument = SupplyType & { _id: number };

const SupplyTypeSchema: Schema = new Schema<SupplyTypeDocument>({
  _id: Number,
  Title: { type: String, required: true }
});

export const SupplyTypeModel = mongoose.model<SupplyTypeDocument>('SupplyType', SupplyTypeSchema);
