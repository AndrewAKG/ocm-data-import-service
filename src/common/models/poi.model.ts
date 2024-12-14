import mongoose, { Schema } from 'mongoose';
import { AddressInfoSchema } from './address-info.model';
import { POI } from '@common/types/poi';
import { DataProviderDocument } from './data-provider.model';
import { UsageTypeSchema } from './usage-type.model';
import { StatusTypeSchema } from './status-type.model';
import { SubmissionStatusSchema } from './submission-status-types.model';
import { OperatorDocument } from './operator.model';
import { DocumentId } from '@common/types/mongo';

export type POIDocument = Omit<POI, 'UUID' | 'ID'> & DocumentId;

// Partial Schemas for Reference Data
const POIDataProviderSchema: Schema<Partial<DataProviderDocument>> = new Schema<Partial<DataProviderDocument>>({
  _id: { type: Number, required: true, index: true },
  Title: { type: String, required: true }
});

const POIOperatorInfoSchema: Schema<Partial<OperatorDocument>> = new Schema<Partial<OperatorDocument>>({
  _id: { type: Number, required: true, index: true },
  Title: { type: String, required: true },
  WebsiteURL: { type: String, required: true }
});

// Main POI Schema
const POISchema: Schema<POIDocument> = new Schema<POIDocument>({
  _id: String,
  IsRecentlyVerified: { type: Boolean, required: true },
  DateLastVerified: { type: String, required: true },
  ParentChargePointID: { type: Number, required: false },
  UsageCost: { type: String, required: false },
  AddressInfo: { type: AddressInfoSchema, required: true },
  NumberOfPoints: { type: Number, required: false },
  GeneralComments: { type: String, required: false },
  DatePlanned: { type: String, required: false },
  DateLastConfirmed: { type: String, required: false },
  DateLastStatusUpdate: { type: String, required: false },
  DataQualityLevel: { type: Number, required: true },
  DateCreated: { type: String, required: true },
  DataProviderID: { type: Number, required: false },
  DataProvidersReference: { type: String, required: false },
  OperatorID: { type: Number, required: false },
  OperatorsReference: { type: String, required: false },
  UsageTypeID: { type: Number, required: false },
  StatusTypeID: { type: Number, required: false },
  SubmissionStatusTypeID: { type: Number, required: false },
  DataProvider: { type: POIDataProviderSchema, required: false },
  OperatorInfo: { type: POIOperatorInfoSchema, required: false },
  UsageType: { type: UsageTypeSchema, required: false },
  StatusType: { type: StatusTypeSchema, required: false },
  SubmissionStatus: { type: SubmissionStatusSchema, required: false }
});

export const POIModel = mongoose.model<POIDocument>('POI', POISchema);
