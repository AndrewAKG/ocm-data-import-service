import dotenv from 'dotenv';
import { createBoundingBoxPartitioningService } from '../services/bounding-box-partitioning.service';
import { DataPartitionModel } from '../models/data-partition.model';
import { connectToDB } from '@common/db/connect';
import { createRabbitMQQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { ingestReferenceData } from '@common/services/ingestion.service';
import { fetchOcmReferenceData } from '@common/services/ocm-api.service';
import { transformReferenceData } from '@common/services/transformation.service';
import {
  bulkWrite,
  deleteOneBulkOperation,
  insertOneBulkOperation,
  updateOneBulkOperation
} from '@common/utils/mongoose';
import { QueueMessage } from '@common/types/queue';

dotenv.config();

const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);
const partitionService = createBoundingBoxPartitioningService();
const maxResults = commonConfig.maxResultsPerApiCall;

const upsertReferenceData = async () => {
  try {
    console.log('Fetching and ingesting reference data...');
    const referenceData = await fetchOcmReferenceData();
    const transformedReferenceData = transformReferenceData(referenceData);

    // Ingest the reference data
    await ingestReferenceData(transformedReferenceData);
    console.log('Reference data ingested successfully.');
  } catch (error) {
    console.error('Error during reference data ingestion:', error);
    throw error;
  }
};

const manageDataPartitions = async () => {
  try {
    console.log('Managing data partitions...');
    const existingDataPartitions = await partitionService.getDataPartitions();

    const {
      dataPartitionsInsertions = [],
      dataPartitionsUpdates = [],
      dataPartitionsDeletions = [],
      messages: queueMessages = []
    } = existingDataPartitions.length
      ? await partitionService.checkForUpdatedPartitions(existingDataPartitions, maxResults)
      : await partitionService.partitionData(maxResults);

    console.log('Performing bulk operations on data partitions...');
    await bulkWrite(DataPartitionModel, dataPartitionsInsertions.map(insertOneBulkOperation));
    await bulkWrite(DataPartitionModel, dataPartitionsUpdates.map(updateOneBulkOperation));
    await bulkWrite(DataPartitionModel, dataPartitionsDeletions.map(deleteOneBulkOperation));

    return queueMessages;
  } catch (error) {
    console.error('Error during data partition management:', error);
    throw error;
  }
};

const sendMessagesToQueue = async (queueMessages: QueueMessage[]) => {
  try {
    if (queueMessages.length) {
      console.log('Sending messages to the queue...');
      const { channel, connection } = await queueService.connectToQueue();

      queueMessages.forEach((message) => queueService.sendMessage(channel, JSON.stringify(message)));

      await channel.waitForConfirms();
      await queueService.closeQueueConnection(connection);
      console.log('Messages sent successfully.');
    }
  } catch (error) {
    console.error('Error during message sending:', error);
    throw error;
  }
};

export const main = async () => {
  try {
    console.log('Producer Service Started');
    await connectToDB();
    await upsertReferenceData();

    const queueMessages = await manageDataPartitions();
    await sendMessagesToQueue(queueMessages);

    console.log('Producer service execution completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error in producer service:', error);
    process.exit(1);
  }
};
