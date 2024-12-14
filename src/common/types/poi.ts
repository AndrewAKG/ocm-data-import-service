import { AddressInfo } from './address-info';
import { Comment } from './comment';
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
  IsRecentlyVerified: boolean;
  DateLastVerified: string;
  ParentChargePointID: number | null;
  UsageCost: string | null;
  AddressInfo: AddressInfo;
  NumberOfPoints: number;
  GeneralComments: string | null;
  DatePlanned: string | null;
  DateLastConfirmed: string | null;
  DateLastStatusUpdate: string | null;
  DataQualityLevel: number;
  DateCreated: string;
  DataProviderID: number;
  DataProvidersReference: string | null;
  OperatorID: number;
  OperatorsReference: string;
  UsageTypeID: number;
  StatusTypeID: number;
  SubmissionStatusTypeID: number;
  MediaItems: MediaItem[] | null;
  Connections: Connection[] | null;
  UserComments?: Comment[] | null;
  DataProvider?: DataProvider | null;
  OperatorInfo?: Operator | null;
  UsageType?: UsageType | null;
  StatusType?: StatusType | null;
  SubmissionStatus?: SubmissionStatus | null;
}

export { SubmissionStatus, UsageType, POI };
