import { DataPartitionModel } from '../models/data-partition.model';
import { generateDataHash } from '../utils/hashing.utils';
import { QueueMessage } from '@common/types/queue';
import { constructBoundingBoxParam, constructPartitionParams, subdivideBoundingBox } from '../utils/boundingbox.utils';
import { BoundingBox, DataPartition, DataPartitionDocument, PartitionService } from '../types/data-partitioning';
import { OcmApiService } from '@common/types/ocm-api';

/**
 * Factory function to create a bounding box partitioning service.
 * Provides methods to get data partitions and manage them.
 */
export const createBoundingBoxPartitioningService = (
  ocmApiService: OcmApiService,
  maxResults: number
): PartitionService => {
  /**
   * Helper Function
   * take a bounding box, evaluates if its embedded data is less than max results we want to get from api
   * if data is less than max => we calculate the hash and
   * return the partition for insertion and a message for data processing
   * if data is more => we sub divide the box and recurse
   * @param boundingBox bounding box having the needed coordinates for constructing the params
   * @param dataPartitionsAccumulator accumulator for data partition insertions
   * @param queueMessagesAccumulator accumulator for messages to be sent to poi data processing queue
   */
  const generateBoundingBoxes = async (
    boundingBox: DataPartition,
    dataPartitionsAccumulator: DataPartition[],
    queueMessagesAccumulator: QueueMessage[]
  ) => {
    const boundingBoxParitionParams = constructPartitionParams(boundingBox, maxResults);
    const result = await ocmApiService.fetchOcmPoiData(boundingBoxParitionParams);
    const resultCount = result.length;

    if (resultCount < maxResults) {
      const dataHash = generateDataHash(result, 'sha256');
      const dataPartition: DataPartition = {
        ...boundingBox,
        dataHash
      };
      dataPartitionsAccumulator.push(dataPartition);

      const queueMessage: QueueMessage = {
        partitionParams: boundingBoxParitionParams
      };
      queueMessagesAccumulator.push(queueMessage);

      console.log(constructBoundingBoxParam(boundingBox), resultCount);
      return;
    }

    // Subdivide the bounding box
    const subBoxes = subdivideBoundingBox(boundingBox);

    // Run sequentially to avoid memory overload
    for (const subBox of subBoxes) {
      await generateBoundingBoxes(subBox, dataPartitionsAccumulator, queueMessagesAccumulator);
    }
  };

  return {
    /**
     * @returns existing data partitions
     */
    getDataPartitions: async () => {
      const existingDataPartitions = await DataPartitionModel.find();
      console.log(`found ${existingDataPartitions.length} partitions`);
      return existingDataPartitions;
    },

    /**
     * process existing data partitions to see if new data is added by re-calculating data hash
     * and comparing to existing data hash
     * if data hash changed within the max results limit => update data partition and send message to queue
     * if data changed outside the max results limit => we do same approach as before by dividing into smaller
     * bounding boxes, where we save them to insert them and delete the parent bounding box for future processing
     * @param existingDataPartitions
     */
    checkForUpdatedPartitions: async (existingDataPartitions: DataPartitionDocument[]) => {
      const dataPartitionsInsertions: DataPartition[] = [];
      const dataPartitionsUpdates: DataPartitionDocument[] = [];
      const dataPartitionsDeletions: DataPartitionDocument[] = [];
      const queueMessages: QueueMessage[] = [];

      // Process each partition sequentially to avoid overloading the memory
      for (const partition of existingDataPartitions) {
        const boundingBoxPartitionParams = constructPartitionParams(partition, maxResults);
        const result = await ocmApiService.fetchOcmPoiData(boundingBoxPartitionParams);
        const resultCount = result.length;

        if (resultCount < maxResults) {
          const newDataHash = generateDataHash(result, 'sha256');

          if (partition.dataHash !== newDataHash) {
            console.log('data hash mismatch => update and re-process partition');
            partition.dataHash = newDataHash;
            dataPartitionsUpdates.push(partition);
            queueMessages.push({ partitionParams: boundingBoxPartitionParams });
          }
          console.log('data hash matches => skip partition');
        } else {
          console.log('data increased => split partition into smaller ones');

          // Subdivide the bounding box
          const subBoxes = subdivideBoundingBox(partition);

          // Run sequentially to avoid memory overload
          for (const subBox of subBoxes) {
            await generateBoundingBoxes(subBox, dataPartitionsInsertions, queueMessages);
          }
          dataPartitionsDeletions.push(partition);
        }
      }

      return {
        dataPartitionsInsertions,
        dataPartitionsUpdates,
        dataPartitionsDeletions,
        messages: queueMessages
      };
    },

    /**
     * partition data by using bounding boxes where we start with the world map bounding box
     */
    partitionData: async () => {
      const dataPartitionsInsertionsAccumulator: DataPartition[] = [];
      const queueMessagesAccumulator: QueueMessage[] = [];
      console.log('Generating bounding boxes...');

      const worldBoundingBox: BoundingBox = {
        topLeftCoordinates: [-90, -180],
        bottomRightCoordinates: [90, 180]
      };

      await generateBoundingBoxes(worldBoundingBox, dataPartitionsInsertionsAccumulator, queueMessagesAccumulator);

      return {
        dataPartitionsInsertions: dataPartitionsInsertionsAccumulator,
        messages: queueMessagesAccumulator
      };
    }
  };
};
