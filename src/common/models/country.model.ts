import { Country } from '@common/types/country';
import { DocumentId } from '@common/types/mongo';
import mongoose, { Schema } from 'mongoose';

export type CountryDocument = Omit<Country, 'ID'> & DocumentId;

const CountrySchema: Schema = new Schema<CountryDocument>({
  _id: Number,
  ISOCode: { type: String, required: true },
  ContinentCode: { type: String, required: true },
  Title: { type: String, required: true }
});

export const CountryModel = mongoose.model<CountryDocument>('Country', CountrySchema);
