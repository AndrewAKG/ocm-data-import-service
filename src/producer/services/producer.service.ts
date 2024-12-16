import { PartitionService } from '../types/data-partitioning';
import { commonConfig } from '@common/config/config';
import { QueueMessage, QueueService } from '@common/types/queue';
import { IngestionService } from '@common/types/ingestion';
import { OcmApiService } from '@common/types/ocm-api';
import { TransformService } from '@common/types/transform';
import { logError, throwError } from '@common/utils/error.utils';

export const createProducerService = (
  ocmApiService: OcmApiService,
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
      throwError(error, 'Error during reference data ingestion');
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
      throwError(error, 'Error during data partition management');
    }
  };

  const sendMessagesToQueue = async (queueMessages: QueueMessage[]) => {
    try {
      if (queueMessages.length) {
        console.log('Sending messages to the queue...');
        await queueService.connectToQueue();

        queueMessages.forEach((message) => queueService.sendMessage(JSON.stringify(message)));

        await queueService.waitForConfirms();
        await queueService.closeQueueConnection();
        console.log('Messages sent successfully.');
      }
    } catch (error) {
      logError(error, 'Error during message sending');
    }
  };

  return {
    main: async () => {
      try {
        console.log('Producer Service Started');
        // upsert reference data
        await upsertReferenceData();

        // partition data
        const maxResults = commonConfig.maxResultsPerApiCall;
        const queueMessages = await manageDataPartitions(maxResults);

        // send messages to processing queue
        await sendMessagesToQueue(queueMessages!);

        console.log('Producer service execution completed successfully.');
      } catch (error) {
        logError(error, 'Error in producer service');
      }
    }
  };
};
