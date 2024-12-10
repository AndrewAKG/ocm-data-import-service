import { ChargerType } from '@common/types/connection';
import mongoose, { Schema, Document } from 'mongoose';

type ChargerTypeDocument = ChargerType & Document;

const LevelSchema: Schema = new Schema<ChargerTypeDocument>({
  _id: Number,
  ID: { type: Number, required: true, unique: true },
  Title: { type: String, required: true },
  Comments: { type: String, required: true },
  IsFastChargeCapable: { type: Boolean, required: true }
});

export const ChargerTypeModel = mongoose.model<ChargerTypeDocument>('ChargerType', LevelSchema);
