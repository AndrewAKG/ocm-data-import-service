import { IngestionService } from '@common/types/ingestion';
import { OCMApiService } from '@common/types/ocm-api';
import { POI } from '@common/types/poi';
import { QueueMessage } from '@common/types/queue';
import { TransformService } from '@common/types/transform';
import { ProcessorService } from '../types/processor';

export const createProcesserService = (
  ocmApiService: OCMApiService,
  transformerService: TransformService,
  ingestionService: IngestionService
): ProcessorService => {
  return {
    processMessage: async (message: QueueMessage) => {
      // fetch the poi data based on the partition params
      const POIData: POI[] = await ocmApiService.fetchOcmPoiData(message.partitionParams);
      console.log('data fetched successfully from OCM API');

      // transform poi data to db compatible format
      const transformedPOIData = transformerService.transformPOIData(POIData);
      console.log('data transformed successfully');

      // ingest data in bulks
      await ingestionService.ingestPOIData(transformedPOIData);
    }
  };
};
