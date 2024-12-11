import { ChargerTypeDocument } from '@common/models/charger-type.model';
import { ChargerType } from '@common/types/charger-type';

export const transformChargerType = (chargerType: ChargerType): ChargerTypeDocument => ({
  ...chargerType,
  _id: chargerType.ID
});
