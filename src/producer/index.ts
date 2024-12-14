import { createOcmApiService } from '@common/services/ocm-api.service';
import { createProducerService } from './services/producer.service';
import { createBoundingBoxPartitioningService } from './services/bounding-box-partitioning.service';
import { createTransformService } from '@common/services/transform.service';
import { createIngestionService } from '@common/services/ingestion.service';
import { createRabbitMQQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';

(async () => {
  const ocmApiService = createOcmApiService(commonConfig.ocmApiBaseUrl, commonConfig.ocmApiKey);
  const partitionService = createBoundingBoxPartitioningService(ocmApiService);
  const transformService = createTransformService();
  const ingestionService = createIngestionService();
  const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);
  const producerService = createProducerService(
    ocmApiService,
    partitionService,
    transformService,
    ingestionService,
    queueService
  );
  await producerService.main();
})();
