import { SupplyTypeDocument } from '@common/models/supply-type.model';
import { SupplyType } from '@common/types/supply-type';

export const transformSupplyType = (supplyType: SupplyType): SupplyTypeDocument => ({
  ...supplyType,
  _id: supplyType.ID
});
