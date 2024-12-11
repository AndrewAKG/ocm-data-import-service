import { ingestPOIData } from '@common/services/ingestion.service';
import { fetchOcmPoiData } from '@common/services/ocm-api.service';
import { transformPOIData } from '@common/services/transformation.service';
import { POI } from '@common/types/poi';
import { QueueMessage } from '@common/types/queue';

export const processMessage = async (message: QueueMessage) => {
  const POIData: POI[] = await fetchOcmPoiData(message.partitionParams);
  console.log('data fetched from OCM API');

  const transformedPOIData = transformPOIData(POIData);
  console.log('data transformed successfully');

  await ingestPOIData(transformedPOIData);
  console.log('message processed successfully');
};
