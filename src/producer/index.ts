import dotenv from 'dotenv';
import { connectToDB } from '@common/db/connect';
import { createBoundingBoxPartitioningService } from './services/bounding-box-partitioning.service';
import { createRabbitMQQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { ingestReferenceData } from '@common/services/ingestion.service';
import { fetchOcmReferenceData } from '@common/services/ocm-api.service';
import { transformReferenceData } from '@common/services/transformation.service';
import { DataPartitionModel } from './models/data-partition.model';
import {
  bulkWrite,
  deleteOneBulkOperation,
  insertOneBulkOperation,
  updateOneBulkOperation
} from '@common/utils/mongoose';

dotenv.config();
const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);
const partitionService = createBoundingBoxPartitioningService();

(async () => {
  console.log('Producer Service Started');
  await connectToDB();

  // upsert reference data one time
  // should be improved to compare hashes before insertion
  const referenceData = await fetchOcmReferenceData();
  const transformedReferenceData = transformReferenceData(referenceData);
  await ingestReferenceData(transformedReferenceData);

  // partition data and get relevant operations
  const existingDataPartitions = await partitionService.getDataPartitions();

  const {
    dataPartitionsInsertions = [],
    dataPartitionsUpdates = [],
    dataPartitionsDeletions = [],
    messages: queueMessages = []
  } = existingDataPartitions.length
    ? await partitionService.checkForUpdatedPartitions(existingDataPartitions)
    : await partitionService.partitionData();

  // write relevant partitions data
  await bulkWrite(DataPartitionModel, dataPartitionsInsertions.map(insertOneBulkOperation));
  await bulkWrite(DataPartitionModel, dataPartitionsUpdates.map(updateOneBulkOperation));
  await bulkWrite(DataPartitionModel, dataPartitionsDeletions.map(deleteOneBulkOperation));

  // Send messages to the queue
  const { channel, connection } = await queueService.connectToQueue();
  queueMessages.forEach((message) => queueService.sendMessage(channel, JSON.stringify(message)));

  await queueService.closeQueueConnection(connection);
  process.exit(0);
})();
