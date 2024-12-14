import { Schema } from 'mongoose';
import { DataProviderStatusType } from '@common/types/data-provider';
import { DocumentId } from '@common/types/mongo';

export type DataProviderStatusTypeDocument = Omit<DataProviderStatusType, 'ID'> & DocumentId;

export const DataProviderStatusTypeSchema: Schema<DataProviderStatusTypeDocument> =
  new Schema<DataProviderStatusTypeDocument>({
    _id: Number,
    Title: { type: String, required: true },
    IsProviderEnabled: { type: Boolean, required: true }
  });
