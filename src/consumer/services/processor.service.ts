import { IngestionService } from '@common/types/ingestion';
import { OcmApiService, ReferenceDataTransformServiceCacheMap } from '@common/types/ocm-api';
import { POI } from '@common/types/poi';
import { QueueMessage } from '@common/types/queue';
import { TransformService } from '@common/types/transform';
import { ProcessorService } from '../types/processor';
import { constructReferenceDataCacheMap } from '@common/utils/cache.utils';

export const createProcesserService = (
  ocmApiService: OcmApiService,
  transformerService: TransformService,
  ingestionService: IngestionService
): ProcessorService => {
  console.log('created Processor Service');
  // Cache reference data at the service level
  let referenceDataCache: ReferenceDataTransformServiceCacheMap | null = null;

  const loadReferenceData = async () => {
    if (!referenceDataCache) {
      console.log('Fetching reference data...');
      const referenceDataResponse = await ocmApiService.fetchOcmReferenceData();
      referenceDataCache = constructReferenceDataCacheMap(referenceDataResponse);

      console.log('Reference data fetched and cached.');
    }
    return referenceDataCache;
  };

  return {
    processMessage: async (message: QueueMessage) => {
      // Ensure reference data is available in cache
      const referenceData = await loadReferenceData();

      // fetch the poi data based on the partition params
      const POIData: POI[] = await ocmApiService.fetchOcmPoiData(message.partitionParams);
      console.log('data fetched successfully from OCM API');

      // transform poi data to db compatible format
      const transformedPOIData = transformerService.transformPOIData(POIData, referenceData);
      console.log('data transformed successfully');

      // ingest data in bulks
      await ingestionService.ingestPOIData(transformedPOIData);
    }
  };
};
