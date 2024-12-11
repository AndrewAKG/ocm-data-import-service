import { DataPartitionModel } from '../models/data-partition.model';
import { fetchOcmPoiData } from '@common/services/ocm-api.service';
import { generateDataHash } from '../utils/hashing-utils';
import { QueueMessage } from '@common/types/queue';
import { constructBoundingBoxParam, subdivideBoundingBox } from '../utils/boundingbox-utils';
import { commonConfig } from '@common/config/config';
import { BoundingBox, DataPartition, DataPartitionDocument, PartitionService } from '../types/data-partitioning';

const maxResults = commonConfig.maxResultsPerApiCall;

const generateBoundingBoxes = async (
  boundingBox: BoundingBox | DataPartition,
  dataPartitionsAccumulator: DataPartition[],
  queueMessagesAccumulator: QueueMessage[]
) => {
  const boundingBoxParitionParams = { boundingbox: constructBoundingBoxParam(boundingBox) };
  const result = await fetchOcmPoiData(boundingBoxParitionParams);
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

export const createBoundingBoxPartitioningService = (): PartitionService => {
  return {
    getDataPartitions: async () => {
      const existingDataPartitions = await DataPartitionModel.find();
      console.log(`found ${existingDataPartitions.length} partitions`);
      return existingDataPartitions;
    },

    checkForUpdatedPartitions: async (existingDataPartitions: DataPartitionDocument[]) => {
      const dataPartitionsInsertions: DataPartition[] = [];
      const dataPartitionsUpdates: DataPartitionDocument[] = [];
      const dataPartitionsDeletions: DataPartitionDocument[] = [];
      const queueMessages: QueueMessage[] = [];

      // Process each partition sequentially to avoid overloading the memory
      for (const partition of existingDataPartitions) {
        const boundingBoxPartitionParams = { boundingbox: constructBoundingBoxParam(partition) };
        const result = await fetchOcmPoiData(boundingBoxPartitionParams);
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
          await generateBoundingBoxes(partition, dataPartitionsInsertions, queueMessages);
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
