import { CheckinStatusTypeDocument } from '@common/models/checkin-status-type.model';
import { CheckinStatusType } from '@common/types/comment';

export const transformCheckinStatusType = (checkinStatusType: CheckinStatusType): CheckinStatusTypeDocument => {
  const { ID, ...rest } = checkinStatusType;
  return {
    ...rest,
    _id: ID
  };
};
