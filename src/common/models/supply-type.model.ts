import { DocumentId } from '@common/types/mongo';
import { SupplyType } from '@common/types/supply-type';
import mongoose, { Schema } from 'mongoose';

export type SupplyTypeDocument = Omit<SupplyType, 'ID'> & DocumentId;

export const SupplyTypeSchema: Schema = new Schema<SupplyTypeDocument>(
  {
    _id: Number,
    Title: { type: String, required: true }
  },
  { collection: 'supply_types' }
);

export const SupplyTypeModel = mongoose.model<SupplyTypeDocument>('SupplyType', SupplyTypeSchema);
