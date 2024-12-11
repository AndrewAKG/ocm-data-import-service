import dotenv from 'dotenv';
import { connectToDB } from '@common/db/connect';
import { partitionOcmDataByBoundingBoxes } from './services/partitioning.service';
import { createQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { ingestReferenceData } from '@common/services/ingestion.service';
import { fetchOcmReferenceData } from '@common/services/ocm-api.service';
import { transformReferenceData } from '@common/services/transformation.service';

dotenv.config();
const queueService = createQueueService(commonConfig.queueUri, commonConfig.queueName);

(async () => {
  console.log('Producer Service Started');
  await connectToDB();

  // upsert reference data one time
  // should be improved to compare hashes before insertion
  const referenceData = await fetchOcmReferenceData();
  const transformedReferenceData = transformReferenceData(referenceData);
  await ingestReferenceData(transformedReferenceData);

  // partition data and insert partitions
  await partitionOcmDataByBoundingBoxes(queueService);
  process.exit(0);
})();
