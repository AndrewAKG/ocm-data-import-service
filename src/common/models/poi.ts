import mongoose, { Schema, Document } from 'mongoose';
import { AddressInfoSchema } from './address-info';
import { ConnectionSchema } from './connection';
import { MediaItemSchema } from './media-item';
import { CommentSchema } from './comment';
import { POI } from '@common/types/poi';
import { DataProviderDocument } from './data-provider';
import { UsageTypeSchema } from './usage-type';
import { StatusTypeSchema } from './status-type';
import { SubmissionStatusSchema } from './submission-status';
import { OperatorDocument } from './operator';

type POIDocument = POI & Document;

// Partial Schemas for Reference Data
const DataProviderSchema: Schema<Partial<DataProviderDocument>> = new Schema<Partial<DataProviderDocument>>({
  _id: { type: Number, required: true },
  Title: { type: String, required: true }
});

const OperatorInfoSchema: Schema<Partial<OperatorDocument>> = new Schema<Partial<OperatorDocument>>({
  ID: { type: Number, required: true },
  Title: { type: String, required: true },
  WebsiteURL: { type: String, required: true }
});

// Main POI Schema
const POISchema: Schema<POIDocument> = new Schema<POIDocument>({
  _id: String,
  ID: { type: Number, required: true, unique: true },
  MediaItems: { type: [MediaItemSchema], default: [] },
  IsRecentlyVerified: { type: Boolean, required: true },
  DateLastVerified: { type: String, required: true },
  ParentChargePointID: { type: Number, required: false },
  UsageCost: { type: String, required: false },
  AddressInfo: { type: AddressInfoSchema, required: true },
  Connections: { type: [ConnectionSchema], default: [] },
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
  UserComments: { type: [CommentSchema], default: [] },
  DataProvider: { type: DataProviderSchema, required: false },
  OperatorInfo: { type: OperatorInfoSchema, required: false },
  UsageType: { type: UsageTypeSchema, required: false },
  StatusType: { type: StatusTypeSchema, required: false },
  SubmissionStatus: { type: SubmissionStatusSchema, required: false }
});

export const POIModel = mongoose.model<POIDocument>('POI', POISchema);
