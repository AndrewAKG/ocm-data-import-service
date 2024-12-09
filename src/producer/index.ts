import dotenv from 'dotenv';
import { connectToDB } from '@common/db/connect';
import { partitionOcmDataByBoundingBoxes } from './services/bounding-box.service';
import { createQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';

dotenv.config();
const queueService = createQueueService(commonConfig.queueUri, commonConfig.queueName);

(async () => {
  console.log('Producer Service Started');
  await connectToDB();
  await partitionOcmDataByBoundingBoxes(queueService);
  process.exit(0);
})();
