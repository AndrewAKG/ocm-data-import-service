import { BoundingBox, BoundingBoxModel } from '../models/bounding-box.model';
import { fetchOcmPoiData } from '@common/services/ocm.service';
import { generateDataHash } from '../utils/hashing-utils';
import { QueueMessage, QueueService } from '@common/types/queue';
import { constructBoundingBoxParam, subdivideBoundingBox } from '../utils/boundingbox-utils';
import { commonConfig } from '@common/config/config';

export const generateBoundingBoxes = async (
  boundingBox: BoundingBox,
  maxResults: number,
  boundingBoxesDataAccumulator: BoundingBox[] = [],
  queueMessagesAccumulator: any[] = []
): Promise<void> => {
  const result = await fetchOcmPoiData(constructBoundingBoxParam(boundingBox));
  const resultCount = result.length;

  if (resultCount < maxResults) {
    const dataHash = generateDataHash(result, 'sha256');
    boundingBox.dataHash = dataHash;
    boundingBoxesDataAccumulator.push(boundingBox);
    queueMessagesAccumulator.push({ boundingBoxQueryParam: constructBoundingBoxParam(boundingBox) });
    console.log(constructBoundingBoxParam(boundingBox), resultCount);
    return;
  }

  // Subdivide the bounding box
  const subBoxes = subdivideBoundingBox(boundingBox);

  // run sequential to avoid memory overload
  for (const subBox of subBoxes) {
    await generateBoundingBoxes(subBox, maxResults, boundingBoxesDataAccumulator, queueMessagesAccumulator);
  }
};

export const validateBoundingBox = async (
  boundingBox: BoundingBox,
  maxResults: number,
  queueMessagesAccumulator: QueueMessage[] = []
) => {
  const result = await fetchOcmPoiData(constructBoundingBoxParam(boundingBox));
  const resultCount = result.length;

  if (resultCount < maxResults) {
    const newDataHash = generateDataHash(result, 'sha256');
    if (newDataHash === boundingBox.dataHash) return;

    queueMessagesAccumulator.push({ boundingBoxQueryParam: constructBoundingBoxParam(boundingBox) });
  } else {
    const boundingBoxesDataAccumulator: BoundingBox[] = [];
    await generateBoundingBoxes(boundingBox, maxResults, boundingBoxesDataAccumulator, queueMessagesAccumulator);

    await BoundingBoxModel.insertMany(boundingBoxesDataAccumulator);
    await BoundingBoxModel.deleteOne({ _id: boundingBox._id });
  }
};

export const partitionOcmDataByBoundingBoxes = async (queueService: QueueService) => {
  const maxResults = commonConfig.maxResultsPerApiCall;

  // Accumulators for messages and bounding boxes
  const queueMessagesAccumulator: QueueMessage[] = [];
  const boundingBoxesDataAccumulator: BoundingBox[] = [];

  // Check if there are existing bounding boxes
  const existingBoundingBoxes = await BoundingBoxModel.find();

  if (!existingBoundingBoxes.length) {
    // If no data partitions exist, generate them
    console.log('Generating bounding boxes...');
    const worldBoundingBox: BoundingBox = {
      topLeftCoordinates: [-90, -180],
      bottomRightCoordinates: [90, 180]
    };

    await generateBoundingBoxes(worldBoundingBox, maxResults, boundingBoxesDataAccumulator, queueMessagesAccumulator);

    // await BoundingBoxModel.insertMany(boundingBoxesDataAccumulator);
    console.log(`Generated ${boundingBoxesDataAccumulator.length} bounding boxes.`);
  } else {
    console.log('found bounding boxes', existingBoundingBoxes.length);

    // If data partitions exist, validate and update them
    // run sequential to avoid memory overload
    for (const boundingBox of existingBoundingBoxes) {
      await validateBoundingBox(boundingBox, maxResults, queueMessagesAccumulator);
    }
  }

  // Send accumulated messages to the queue
  // const { channel, connection } = await queueService.connectToQueue();
  // queueMessagesAccumulator.forEach((message) => queueService.sendMessage(channel, JSON.stringify(message)));

  // await queueService.closeQueueConnection(connection);
};
