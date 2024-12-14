import { POIDocument } from '@common/models/poi.model';
import { SubmissionStatusDocument } from '@common/models/submission-status-types.model';
import { UsageTypeDocument } from '@common/models/usage-type.model';
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

export const transformPOI = (poi: POI): POIDocument => {
  const { UUID, ID, ...rest } = poi;
  return {
    ...rest,
    _id: UUID
  };
};
