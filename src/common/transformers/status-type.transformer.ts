import { StatusTypeDocument } from '@common/models/status-type.model';
import { StatusType } from '@common/types/status-types';

export const transformStatusType = (statusType: StatusType): StatusTypeDocument => {
  const { ID, ...rest } = statusType;
  return {
    ...rest,
    _id: ID
  };
};
