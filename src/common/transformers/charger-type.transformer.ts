import { ChargerTypeDocument } from '@common/models/charger-type.model';
import { ChargerType } from '@common/types/charger-type';

export const transformChargerType = (chargerType: ChargerType): ChargerTypeDocument => {
  const { ID, ...rest } = chargerType;
  return {
    ...rest,
    _id: ID
  };
};
