import {
  ChargerTypeDocument,
  CheckinStatusTypeDocument,
  CommentDocument,
  CommentTypeDocument,
  ConnectionDocument,
  ConnectionTypeDocument,
  CountryDocument,
  DataProviderDocument,
  MediaItemDocument,
  OperatorDocument,
  POIDocument,
  StatusTypeDocument,
  SubmissionStatusDocument,
  SupplyTypeDocument,
  UsageTypeDocument
} from '@common/models';

export interface TransformedReferenceData {
  ChargerTypes: ChargerTypeDocument[];
  ConnectionTypes: ConnectionTypeDocument[];
  CheckinStatusTypes: CheckinStatusTypeDocument[];
  Countries: CountryDocument[];
  CurrentTypes: SupplyTypeDocument[];
  DataProviders: DataProviderDocument[];
  Operators: OperatorDocument[];
  StatusTypes: StatusTypeDocument[];
  SubmissionStatusTypes: SubmissionStatusDocument[];
  UsageTypes: UsageTypeDocument[];
  UserCommentTypes: CommentTypeDocument[];
}

export interface TransformedPOIDataItem {
  POI: POIDocument;
  Comments: CommentDocument[];
  Connections: ConnectionDocument[];
  MediaItems: MediaItemDocument[];
}

export type TransformedPOIData = TransformedPOIDataItem[];
