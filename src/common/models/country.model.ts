import { Country } from '@common/types/country';
import mongoose, { Schema } from 'mongoose';

export type CountryDocument = Country & { _id: number };

const CountrySchema: Schema = new Schema<CountryDocument>({
  _id: Number,
  ISOCode: { type: String, required: true, index: true },
  ContinentCode: { type: String, required: true },
  Title: { type: String, required: true }
});

export const CountryModel = mongoose.model<CountryDocument>('Country', CountrySchema);
