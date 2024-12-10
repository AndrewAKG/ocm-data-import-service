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
  MediaItems: MediaItem[];
  IsRecentlyVerified: boolean;
  DateLastVerified: string;
  ParentChargePointID: number;
  UsageCost: string;
  AddressInfo: AddressInfo;
  Connections: Connection[];
  NumberOfPoints: number;
  GeneralComments: string;
  DatePlanned: string;
  DateLastConfirmed: string;
  DateLastStatusUpdate: string;
  DataQualityLevel: number;
  DateCreated: string;
  DataProviderID: number;
  DataProvidersReference: string;
  OperatorID: number;
  OperatorsReference: string;
  UsageTypeID: number;
  StatusTypeID: number;
  SubmissionStatusTypeID: number;
  UserComments?: Comment[] | null;
  DataProvider?: DataProvider | null;
  OperatorInfo?: Operator | null;
  UsageType?: UsageType | null;
  StatusType?: StatusType | null;
  SubmissionStatus?: SubmissionStatus | null;
}

export { SubmissionStatus, UsageType, POI };
