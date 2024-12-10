import { AddressInfo } from './address-info';
import { Connection } from './connection';
import { DataProvider } from './data-provider';
import { MediaItem } from './media-item';
import { Operator } from './operator';
import { StatusType } from './status-types';

interface SubmissionStatus {
  ID: number;
  Title: string;
  IsLive: boolean;
}

interface UsageType {
  IsPayAtLocation: boolean;
  IsMembershipRequired: boolean;
  IsAccessKeyRequired: boolean;
  ID: number;
  Title: string;
}

interface POI {
  ID: number;
  UUID: string;
  UserComments: Comment[];
  MediaItems: MediaItem[];
  IsRecentlyVerified: boolean;
  DateLastVerified: string;
  ParentChargePointID?: number | null;
  DataProviderID: number;
  DataProvidersReference?: string | null;
  OperatorID: number;
  OperatorsReference?: string | null;
  UsageTypeID: number;
  UsageCost?: string | null;
  AddressInfo: AddressInfo;
  Connections: Connection[];
  NumberOfPoints: number;
  GeneralComments: string;
  DatePlanned?: string | null;
  DateLastConfirmed?: string | null;
  StatusTypeID: number;
  DateLastStatusUpdate: string;
  MetadataValues: unknown[]; // Assuming unknown structure for now
  DataQualityLevel: number;
  DateCreated: string;
  SubmissionStatusTypeID: number;
  DataProvider: DataProvider;
  OperatorInfo: Operator;
  UsageType: UsageType;
  StatusType: StatusType;
  SubmissionStatus: SubmissionStatus;
}

export { SubmissionStatus, UsageType, POI };
