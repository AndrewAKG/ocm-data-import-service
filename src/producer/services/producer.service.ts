import dotenv from 'dotenv';
import { PartitionService } from '../types/data-partitioning';
import { connectToDB } from '@common/db/connect';
import { commonConfig } from '@common/config/config';
import { QueueMessage, QueueService } from '@common/types/queue';
import { IngestionService } from '@common/types/ingestion';
import { OCMApiService } from '@common/types/ocm-api';
import { TransformService } from '@common/types/transform';

dotenv.config();

export const createProducerService = (
  ocmApiService: OCMApiService,
  partitionService: PartitionService,
  transformService: TransformService,
  ingestionService: IngestionService,
  queueService: QueueService
) => {
  const upsertReferenceData = async () => {
    try {
      console.log('Fetching and ingesting reference data...');
      const referenceData = await ocmApiService.fetchOcmReferenceData();
      const transformedReferenceData = transformService.transformReferenceData(referenceData);

      // Ingest the reference data
      await ingestionService.ingestReferenceData(transformedReferenceData);
      console.log('Reference data ingested successfully.');
    } catch (error) {
      console.error('Error during reference data ingestion:', error);
      throw error;
    }
  };

  const manageDataPartitions = async (maxResults: number) => {
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

  return {
    main: async () => {
      try {
        console.log('Producer Service Started');
        await connectToDB();

        // upsert reference data
        await upsertReferenceData();

        // partition data
        const maxResults = commonConfig.maxResultsPerApiCall;
        const queueMessages = await manageDataPartitions(maxResults);

        // send messages to processing queue
        await sendMessagesToQueue(queueMessages);

        console.log('Producer service execution completed successfully.');
      } catch (error) {
        console.error('Error in producer service:', error);
      }
    }
  };
};
