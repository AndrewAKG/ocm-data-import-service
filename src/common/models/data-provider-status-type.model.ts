import mongoose, { Schema, Document } from 'mongoose';
import { DataProviderStatusType } from '@common/types/data-provider';

type DataProviderStatusTypeDocument = DataProviderStatusType & Document;

export const DataProviderStatusTypeSchema: Schema<DataProviderStatusTypeDocument> =
  new Schema<DataProviderStatusTypeDocument>({
    _id: Number,
    Title: { String, required: true },
    IsProviderEnabled: { type: Boolean, required: true }
  });

export const DataProviderStatusTypeModel = mongoose.model<DataProviderStatusTypeDocument>(
  'DataProviderStatusType',
  DataProviderStatusTypeSchema
);
