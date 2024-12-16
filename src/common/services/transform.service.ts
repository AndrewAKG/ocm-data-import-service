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
import { ReferenceDataResponse, ReferenceDataTransformServiceCacheMap } from '@common/types/ocm-api';
import { POI } from '@common/types/poi';
import { TransformService } from '@common/types/transform';
import { TransformedPOIData, TransformedPOIDataItem, TransformedReferenceData } from '@common/types/transformers';

export const createTransformService = (): TransformService => {
  /**
   * Transforms a single POI item into a structure with nested entities.
   * @param POI - The POI object to transform.
   * @returns TransformedPOIDataItem - The transformed POI data.
   */
  const transformPOIDataItem = (
    POI: POI,
    referenceData: ReferenceDataTransformServiceCacheMap
  ): TransformedPOIDataItem => ({
    POI: transformPOI(POI, referenceData),
    Comments: POI.UserComments?.map((comment) => transformComment(POI.UUID, comment)) || [],
    Connections: POI.Connections?.map((connection) => transformConnection(POI.UUID, connection)) || [],
    MediaItems: POI.MediaItems?.map((mediaItem) => transformMediaItem(POI.UUID, mediaItem)) || []
  });

  return {
    /**
     * Transforms the reference data from the OCM API into the required structure.
     * @param referenceData - The reference data from the OCM API.
     * @returns TransformedReferenceData - The transformed reference data.
     */
    transformReferenceData: (referenceData: ReferenceDataResponse): TransformedReferenceData => ({
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
    }),

    /**
     * Transforms an array of POI data.
     * @param POIs - The array of POIs to transform.
     * @returns TransformedPOIData - The transformed POI data.
     */
    transformPOIData: (POIs: POI[], referenceData: ReferenceDataTransformServiceCacheMap): TransformedPOIData =>
      POIs.map((POI) => transformPOIDataItem(POI, referenceData))
  };
};
