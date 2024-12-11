import { ChargerType } from './charger-type';
import { CheckinStatusType, CommentType } from './comment';
import { ConnectionType } from './connection';
import { Country } from './country';
import { DataProvider } from './data-provider';
import { Operator } from './operator';
import { POI, SubmissionStatus, UsageType } from './poi';
import { StatusType } from './status-types';
import { SupplyType } from './supply-type';

export interface ReferenceDataResponse {
  ChargerTypes: ChargerType[];
  ConnectionTypes: ConnectionType[];
  CheckinStatusTypes: CheckinStatusType[];
  Countries: Country[];
  CurrentTypes: SupplyType[];
  DataProviders: DataProvider[];
  DataTypes: any;
  MetadataGroups: string | null;
  Operators: Operator[];
  StatusTypes: StatusType[];
  SubmissionStatusTypes: SubmissionStatus[];
  UsageTypes: UsageType[];
  UserCommentTypes: CommentType[];
}

export type POIDataResponse = POI[];
