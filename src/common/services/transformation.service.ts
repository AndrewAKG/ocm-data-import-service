import {
  transformChargerType,
  transformConnectionType,
  transformCheckinStatusType,
  transformCountry,
  transformSupplyType,
  transformDataProvider,
  transformOperator,
  transformStatusType,
  transformSubmissionStatus,
  transformUsageType,
  transformComment,
  transformCommentType,
  transformPOI,
  transformConnection,
  transformMediaItem
} from '@common/transformers';
import { ReferenceDataResponse } from '@common/types/ocm-api';
import { POI } from '@common/types/poi';
import { TransformedPOIData, TransformedPOIDataItem, TransformedReferenceData } from '@common/types/transformers';

export const transformReferenceData = (referenceData: ReferenceDataResponse): TransformedReferenceData => ({
  ChargerTypes: referenceData.ChargerTypes.map(transformChargerType),
  ConnectionTypes: referenceData.ConnectionTypes.map(transformConnectionType),
  CheckinStatusTypes: referenceData.CheckinStatusTypes.map(transformCheckinStatusType),
  Countries: referenceData.Countries.map(transformCountry),
  CurrentTypes: referenceData.CurrentTypes.map(transformSupplyType),
  DataProviders: referenceData.DataProviders.map(transformDataProvider),
  Operators: referenceData.Operators.map(transformOperator),
  StatusTypes: referenceData.StatusTypes.map(transformStatusType),
  SubmissionStatusTypes: referenceData.SubmissionStatusTypes.map(transformSubmissionStatus),
  UsageTypes: referenceData.UsageTypes.map(transformUsageType),
  UserCommentTypes: referenceData.UserCommentTypes.map(transformCommentType)
});

const transformPOIDataItem = (POI: POI): TransformedPOIDataItem => ({
  POI: transformPOI(POI),
  Comments: POI.UserComments?.map((comment) => transformComment(POI.UUID, comment)) || [],
  Connections: POI.Connections?.map((connection) => transformConnection(POI.UUID, connection)) || [],
  MediaItems: POI.MediaItems?.map((mediaItem) => transformMediaItem(POI.UUID, mediaItem)) || []
});

export const transformPOIData = (POIs: POI[]): TransformedPOIData => {
  return POIs.map(transformPOIDataItem);
};
