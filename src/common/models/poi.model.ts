import mongoose, { Schema } from 'mongoose';
import { AddressInfoSchema } from './address-info.model';
import { POI } from '@common/types/poi';
import { UsageTypeDocument } from './usage-type.model';
import { StatusTypeDocument } from './status-type.model';
import { SubmissionStatusDocument } from './submission-status-types.model';
import { DocumentId } from '@common/types/mongo';
import { DataProviderSchema } from './data-provider.model';
import { OperatorSchema } from './operator.model';
import { ChargerTypeDocument } from './charger-type.model';

export interface POIDocument extends Omit<POI, 'UUID' | 'UsageType' | 'SubmissionStatus' | 'StatusType'>, DocumentId {
  ChargerType: {
    IsFastChargeCapable: boolean;
  };
  UsageType: {
    IsPayAtLocation: boolean;
    IsMembershipRequired: boolean;
    IsAccessKeyRequired: boolean;
  };
  SubmissionStatus: {
    IsLive: boolean;
  };
  StatusType: {
    IsOperational: boolean;
  };
}

// Partial Schema for Usage Type
const POIUsageTypeSchema: Schema<Partial<UsageTypeDocument>> = new Schema<Partial<UsageTypeDocument>>(
  {
    IsPayAtLocation: { type: Boolean, required: true, index: true },
    IsMembershipRequired: { type: Boolean, required: true, index: true },
    IsAccessKeyRequired: { type: Boolean, required: true, index: true }
  },
  { _id: false }
);

// Partial Schema for Charger Type
const POIChargerTypeSchema: Schema<Partial<ChargerTypeDocument>> = new Schema<Partial<ChargerTypeDocument>>(
  {
    IsFastChargeCapable: { type: Boolean, required: true, index: true }
  },
  { _id: false }
);

// Partial Schema for Submission Status
const POISubmissionStatusSchema: Schema<Partial<SubmissionStatusDocument>> = new Schema<
  Partial<SubmissionStatusDocument>
>(
  {
    IsLive: { type: Boolean, required: true, index: true }
  },
  { _id: false }
);

// Partial Schema for Status Type
const POIStatusTypeSchema: Schema<Partial<StatusTypeDocument>> = new Schema<Partial<StatusTypeDocument>>(
  {
    IsOperational: { type: Boolean, required: true, index: true }
  },
  { _id: false }
);

const POISchema: Schema<POIDocument> = new Schema<POIDocument>({
  _id: String,
  ID: { type: Number, required: true },
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
  OperatorID: { type: Number, required: false, index: true },
  OperatorsReference: { type: String, required: false },
  UsageTypeID: { type: Number, required: false },
  StatusTypeID: { type: Number, required: false },
  SubmissionStatusTypeID: { type: Number, required: false },
  DataProvider: { type: DataProviderSchema, required: false },
  OperatorInfo: { type: OperatorSchema, required: false },
  UsageType: { type: POIUsageTypeSchema, required: true },
  StatusType: { type: POIStatusTypeSchema, required: true },
  SubmissionStatus: { type: POISubmissionStatusSchema, required: true },
  ChargerType: { type: POIChargerTypeSchema, required: true }
});

export const POIModel = mongoose.model<POIDocument>('POI', POISchema);
