import dotenv from 'dotenv';
import { connectToDB } from '../common/db-connection';
import { BoundingBox, BoundingBoxModel } from './models/BoundingBox';
import { generateBoundingBoxes, validateBoundingBox } from './services/bounding-box.service';
import { commonConfig } from '../common/config';

dotenv.config();

(async () => {
  await connectToDB();

  // check if there is existing bounding boxes (data partitions)
  const existingBoundingBoxes = await BoundingBoxModel.find();

  // no data partitions => generate and insert
  if (!existingBoundingBoxes.length) {
    const worldBoundingBox: BoundingBox = {
      topLeftCoordinates: [-90, -180],
      bottomRightCoordinates: [90, 180]
    };

    const boundingBoxesDataAccumulator: BoundingBox[] = [];

    console.log('Generating bounding boxes...');
    await generateBoundingBoxes(worldBoundingBox, commonConfig.maxResultsPerApiCall, boundingBoxesDataAccumulator);

    // insert bounding boxes with their hashes
    await BoundingBoxModel.insertMany(boundingBoxesDataAccumulator);

    console.log(`Generated ${boundingBoxesDataAccumulator.length} bounding boxes.`);

    // TO-DO
    // send messages to queue
  }

  // data partitions exist, validate and update
  if (existingBoundingBoxes.length) {
    await Promise.all(
      existingBoundingBoxes.map((boundingBox) => validateBoundingBox(boundingBox, commonConfig.maxResultsPerApiCall))
    );
  }

  process.exit(0);
})();
