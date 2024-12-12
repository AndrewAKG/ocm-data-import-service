import { ingestPOIData } from '@common/services/ingestion.service';
import { fetchOcmPoiData } from '@common/services/ocm-api.service';
import { transformPOIData } from '@common/services/transformation.service';
import { POI } from '@common/types/poi';
import { QueueMessage } from '@common/types/queue';

export const processMessage = async (message: QueueMessage) => {
  // fetch the poi data based on the partition params
  const POIData: POI[] = await fetchOcmPoiData(message.partitionParams);
  console.log('data fetched successfully from OCM API');

  // transform poi data to db compatible format
  const transformedPOIData = transformPOIData(POIData);
  console.log('data transformed successfully');

  // ingest data in bulks
  await ingestPOIData(transformedPOIData);
};
