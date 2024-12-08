import { config } from './config/config';
import { BoundingBox } from './models/BoundingBox';
import { generateBoundingBoxes } from './services/bounding-box.service';

(async () => {
  const worldBoundingBox: BoundingBox = {
    topLeftCoordinates: [-90, -180],
    bottomRightCoordinates: [90, 180]
  };

  const boundingBoxes: BoundingBox[] = [];

  console.log('Generating bounding boxes...');
  await generateBoundingBoxes(worldBoundingBox, config.maxResults, boundingBoxes);

  console.log(`Generated ${boundingBoxes.length} bounding boxes.`);
  process.exit(0);
})();
