import mongoose, { Schema } from 'mongoose';
import { DataProviderStatusType } from '@common/types/data-provider';

export type DataProviderStatusTypeDocument = DataProviderStatusType & { _id: number };

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
