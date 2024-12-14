import dotenv from 'dotenv';
import { createBoundingBoxPartitioningService } from '../services/bounding-box-partitioning.service';
import { PartitionService } from '../types/data-partitioning';
import { connectToDB } from '@common/db/connect';
import { createRabbitMQQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { createIngestionService } from '@common/services/ingestion.service';
import { fetchOcmReferenceData } from '@common/services/ocm-api.service';
import { transformReferenceData } from '@common/services/transformation.service';
import { QueueMessage, QueueService } from '@common/types/queue';
import { IngestionService } from '@common/types/ingestion';

dotenv.config();

const upsertReferenceData = async (ingestionService: IngestionService) => {
  try {
    console.log('Fetching and ingesting reference data...');
    const referenceData = await fetchOcmReferenceData();
    const transformedReferenceData = transformReferenceData(referenceData);

    // Ingest the reference data
    await ingestionService.ingestReferenceData(transformedReferenceData);
    console.log('Reference data ingested successfully.');
  } catch (error) {
    console.error('Error during reference data ingestion:', error);
    throw error;
  }
};

const manageDataPartitions = async (
  partitionService: PartitionService,
  maxResults: number,
  ingestionService: IngestionService
) => {
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

    await ingestionService.ingestDataPartitions(
      dataPartitionsInsertions,
      dataPartitionsUpdates,
      dataPartitionsDeletions
    );
    return queueMessages;
  } catch (error) {
    console.error('Error during data partition management:', error);
    throw error;
  }
};

const sendMessagesToQueue = async (queueService: QueueService, queueMessages: QueueMessage[]) => {
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

    const ingestionService = createIngestionService();

    // upsert reference data
    await upsertReferenceData(ingestionService);

    // partition data
    const partitionService = createBoundingBoxPartitioningService();
    const maxResults = commonConfig.maxResultsPerApiCall;
    const queueMessages = await manageDataPartitions(partitionService, maxResults, ingestionService);

    // send messages to processing queue
    const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);
    await sendMessagesToQueue(queueService, queueMessages);

    console.log('Producer service execution completed successfully.');
  } catch (error) {
    console.error('Error in producer service:', error);
  }
};
