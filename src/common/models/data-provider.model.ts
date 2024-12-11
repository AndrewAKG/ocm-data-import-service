import { DataProvider } from '@common/types/data-provider';
import { DataProviderStatusTypeSchema } from './data-provider-status-type.model'; // Import the schema
import mongoose, { Schema } from 'mongoose';

export type DataProviderDocument = DataProvider & { _id: number };

const DataProviderSchema: Schema<DataProviderDocument> = new Schema<DataProviderDocument>({
  _id: Number,
  Title: { type: String, required: true },
  WebsiteURL: { type: String, required: true },
  Comments: { type: String, required: false },
  DataProviderStatusType: { type: DataProviderStatusTypeSchema, required: true },
  IsRestrictedEdit: { type: Boolean, required: true },
  IsOpenDataLicensed: { type: Boolean, required: true },
  IsApprovedImport: { type: Boolean, required: true },
  License: { type: String, required: true },
  DateLastImported: { type: String, required: false }
});

export const DataProviderModel = mongoose.model<DataProviderDocument>('DataProvider', DataProviderSchema);
