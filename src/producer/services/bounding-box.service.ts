import { BoundingBox } from '../models/BoundingBox';
import { fetchOCMResults } from './ocm.service';

export const constructBoundingBoxParam = (boundingBox: BoundingBox): string => {
  const { topLeftCoordinates, bottomRightCoordinates } = boundingBox;
  return `(${topLeftCoordinates[0]},${topLeftCoordinates[1]}),(${bottomRightCoordinates[0]},${bottomRightCoordinates[1]})`;
};

export const subdivideBoundingBox = (boundingBox: BoundingBox): BoundingBox[] => {
  const [lat1, lng1] = boundingBox.topLeftCoordinates;
  const [lat2, lng2] = boundingBox.bottomRightCoordinates;

  // Decide whether to split horizontally (latitude) or vertically (longitude)
  const isHorizontalSplit = Math.abs(lat2 - lat1) > Math.abs(lng2 - lng1);

  if (isHorizontalSplit) {
    const midLat = (lat1 + lat2) / 2;
    return [
      { topLeftCoordinates: [lat1, lng1], bottomRightCoordinates: [midLat, lng2] },
      { topLeftCoordinates: [midLat, lng1], bottomRightCoordinates: [lat2, lng2] }
    ];
  } else {
    const midLng = (lng1 + lng2) / 2;
    return [
      { topLeftCoordinates: [lat1, lng1], bottomRightCoordinates: [lat2, midLng] },
      { topLeftCoordinates: [lat1, midLng], bottomRightCoordinates: [lat2, lng2] }
    ];
  }
};

export const generateBoundingBoxes = async (
  boundingBox: BoundingBox,
  maxResults: number,
  accumulator: BoundingBox[] = []
): Promise<void> => {
  const result = await fetchOCMResults(constructBoundingBoxParam(boundingBox));
  const resultCount = result.length;

  if (resultCount <= maxResults) {
    // Add the bounding box to the accumulator if it's within the limit
    accumulator.push(boundingBox);
    return;
  }

  // Subdivide the bounding box into smaller regions
  const subBoxes = subdivideBoundingBox(boundingBox);

  // Recursively generate bounding boxes for each sub-box in parallel
  await Promise.all(subBoxes.map((box) => generateBoundingBoxes(box, maxResults, accumulator)));
};
