import { POIDocument } from '@common/models/poi.model';
import { SubmissionStatusDocument } from '@common/models/submission-status-types.model';
import { UsageTypeDocument } from '@common/models/usage-type.model';
import { ReferenceDataTransformServiceCacheMap } from '@common/types/ocm-api';
import { POI, SubmissionStatus, UsageType } from '@common/types/poi';

export const transformSubmissionStatus = (submissionStatus: SubmissionStatus): SubmissionStatusDocument => {
  const { ID, ...rest } = submissionStatus;
  return {
    ...rest,
    _id: ID
  };
};

export const transformUsageType = (usageType: UsageType): UsageTypeDocument => {
  const { ID, ...rest } = usageType;
  return {
    ...rest,
    _id: ID
  };
};

export const transformPOI = (poi: POI, referenceData: ReferenceDataTransformServiceCacheMap): POIDocument => {
  const { UUID, ...rest } = poi;

  const fastChargingIds = Object.entries(referenceData.ChargerTypes)
    .filter(([id, details]) => details.IsFastChargeCapable)
    .map(([id]) => Number(id));

  const IsFastChargeCapable =
    poi.Connections?.some((connection) => fastChargingIds.includes(connection.LevelID)) || false;
  return {
    ...rest,
    _id: UUID,
    UsageType: referenceData.UsageTypes[poi.UsageTypeID],
    SubmissionStatus: referenceData.SubmissionStatusTypes[poi.SubmissionStatusTypeID],
    StatusType: referenceData.StatusTypes[poi.StatusTypeID],
    ChargerType: {
      IsFastChargeCapable
    }
  };
};
