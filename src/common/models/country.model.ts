import { Country } from '@common/types/country';
import mongoose, { Schema, Document } from 'mongoose';

type CountryDocument = Country & Document;

const CountrySchema: Schema = new Schema<CountryDocument>({
  _id: Number,
  ISOCode: { type: String, required: true },
  ContinentCode: { type: String, required: true },
  Title: { type: String, required: true }
});

export const CountryModel = mongoose.model<CountryDocument>('Country', CountrySchema);
