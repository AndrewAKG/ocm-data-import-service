import dotenv from 'dotenv';
import { createRabbitMQQueueService } from '@common/services/rabbitmq.service';
import { commonConfig } from '@common/config/config';
import { createProcesserService } from './services/processor.service';
import { createConsumerService } from './services/consumer.service';
import { createTransformService } from '@common/services/transform.service';
import { createIngestionService } from '@common/services/ingestion.service';
import { createOcmApiService } from '@common/services/ocm-api.service';
import { connectToDB } from '@common/utils/db.utils';

dotenv.config();

(async () => {
  await connectToDB(commonConfig.mongoUri);

  const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);
  const ocmApiService = createOcmApiService(commonConfig.ocmApiBaseUrl, commonConfig.ocmApiKey);
  const transformService = createTransformService();
  const ingestionService = createIngestionService();
  const processorService = createProcesserService(ocmApiService, transformService, ingestionService);
  const consumerService = createConsumerService(queueService, processorService);
  await consumerService.main();
})();
