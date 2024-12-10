import { ChargerType } from './charger-type';
import { CheckinStatusType, CommentType } from './comment';
import { ConnectionType, SupplyType } from './connection';
import { Country } from './country';
import { DataProvider } from './data-provider';
import { Operator } from './operator';
import { SubmissionStatus, UsageType } from './poi';
import { StatusType } from './status-types';

export interface ReferenceDataResponse {
  ChargerTypes: ChargerType[];
  ConnectionTypes: ConnectionType[];
  CheckinStatusTypes: CheckinStatusType[];
  Countries: Country[];
  CurrentTypes: SupplyType[];
  DataProviders: DataProvider[];
  DataTypes: any; // Replace with proper type if structure is known
  MetadataGroups: string | null;
  Operators: Operator[];
  StatusTypes: StatusType[];
  SubmissionStatusTypes: SubmissionStatus[];
  UsageTypes: UsageType[];
  UserCommentTypes: CommentType[];
}
