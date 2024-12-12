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

  /** 
    upsert reference data one time
    should be improved to compare hashes before insertion
  */
  const referenceData = await fetchOcmReferenceData();
  const transformedReferenceData = transformReferenceData(referenceData);
  await ingestReferenceData(transformedReferenceData);

  /** 
    check if partitions exists in db => check for updates
    if not exists => partition data and save them in db
  */
  const existingDataPartitions = await partitionService.getDataPartitions();

  const {
    dataPartitionsInsertions = [],
    dataPartitionsUpdates = [],
    dataPartitionsDeletions = [],
    messages: queueMessages = []
  } = existingDataPartitions.length
    ? await partitionService.checkForUpdatedPartitions(existingDataPartitions)
    : await partitionService.partitionData();

  /**
   * gather needed operations for calculated data partitions to save in db
   */
  await bulkWrite(DataPartitionModel, dataPartitionsInsertions.map(insertOneBulkOperation));
  await bulkWrite(DataPartitionModel, dataPartitionsUpdates.map(updateOneBulkOperation));
  await bulkWrite(DataPartitionModel, dataPartitionsDeletions.map(deleteOneBulkOperation));

  /**
   * Send messages to the queue for reliable horizontally scalable processing
   * send parition params where consumer will process specific data partition
   * according to the message received
   */
  if (queueMessages.length) {
    const { channel, connection } = await queueService.connectToQueue();

    queueMessages.forEach((message) => queueService.sendMessage(channel, JSON.stringify(message)));

    await channel.waitForConfirms();
    await queueService.closeQueueConnection(connection);
  }

  // finish the execution
  process.exit(0);
})();
