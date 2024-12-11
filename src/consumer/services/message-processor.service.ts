import { fetchOcmPoiData } from '@common/services/ocm-api.service';
import { transformPOIData } from '@common/services/transformation.service';
import { POI } from '@common/types/poi';
import { QueueMessage } from '@common/types/queue';

export const processMessage = async (message: QueueMessage) => {
  const POIData: POI[] = await fetchOcmPoiData(message.partitionParams);
  const transformedPOIData = transformPOIData(POIData);
};
