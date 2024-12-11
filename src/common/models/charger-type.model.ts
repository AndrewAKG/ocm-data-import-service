import { ChargerType } from '@common/types/charger-type';
import mongoose, { Schema } from 'mongoose';

export type ChargerTypeDocument = ChargerType & { _id: number };

export const ChargerTypeSchema: Schema = new Schema<ChargerTypeDocument>(
  {
    _id: Number,
    Title: { type: String, required: true },
    Comments: { type: String, required: true },
    IsFastChargeCapable: { type: Boolean, required: true, index: true }
  },
  { collection: 'charger_types' }
);

export const ChargerTypeModel = mongoose.model<ChargerTypeDocument>('ChargerType', ChargerTypeSchema);
