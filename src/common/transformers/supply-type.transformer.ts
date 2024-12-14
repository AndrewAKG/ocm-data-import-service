import { SupplyTypeDocument } from '@common/models/supply-type.model';
import { SupplyType } from '@common/types/supply-type';

export const transformSupplyType = (supplyType: SupplyType): SupplyTypeDocument => {
  const { ID, ...rest } = supplyType;
  return {
    ...rest,
    _id: ID
  };
};
