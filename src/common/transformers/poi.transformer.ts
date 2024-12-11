import { POIDocument } from '@common/models/poi.model';
import { SubmissionStatusDocument } from '@common/models/submission-status-types.model';
import { UsageTypeDocument } from '@common/models/usage-type.model';
import { POI, SubmissionStatus, UsageType } from '@common/types/poi';

export const transformSubmissionStatus = (submissionStatus: SubmissionStatus): SubmissionStatusDocument => ({
  ...submissionStatus,
  _id: submissionStatus.ID
});

export const transformUsageType = (usageType: UsageType): UsageTypeDocument => ({
  ...usageType,
  _id: usageType.ID
});

export const transformPOI = (poi: POI): POIDocument => ({
  ...poi,
  _id: poi.UUID
});
