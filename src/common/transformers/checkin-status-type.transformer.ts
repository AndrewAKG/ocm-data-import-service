import { CheckinStatusTypeDocument } from '@common/models/checkin-status-type.model';
import { CheckinStatusType } from '@common/types/comment';

export const transformCheckinStatusType = (checkinStatusType: CheckinStatusType): CheckinStatusTypeDocument => ({
  ...checkinStatusType,
  _id: checkinStatusType.ID
});
