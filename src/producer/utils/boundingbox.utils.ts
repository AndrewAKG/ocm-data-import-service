import { OCMApiQueryParams } from '@common/types/ocm-api';
import { BoundingBox } from '../types/data-partitioning';
import { commonConfig } from '@common/config/config';

/**
 * @param boundingBox containing coordinates needed
 * @returns bounding box compatible format for ocm api
 */
export const constructBoundingBoxParam = (boundingBox: BoundingBox): string => {
  const { topLeftCoordinates, bottomRightCoordinates } = boundingBox;
  return `(${topLeftCoordinates[0]},${topLeftCoordinates[1]}),(${bottomRightCoordinates[0]},${bottomRightCoordinates[1]})`;
};

export const constructPartitionParams = (boundingBox: BoundingBox, maxResults: number): OCMApiQueryParams => {
  const boundingBoxParam = constructBoundingBoxParam(boundingBox);
  return {
    boundingbox: boundingBoxParam,
    maxresults: maxResults,
    ...commonConfig.commonPartitioningParams
  };
};

/**
 * splits bounding box into two equal halves horizontally or vertically
 * @param boundingBox containing coordinates
 * @returns two bounding boxes
 */
export const subdivideBoundingBox = (boundingBox: BoundingBox): BoundingBox[] => {
  const [lat1, lng1] = boundingBox.topLeftCoordinates;
  const [lat2, lng2] = boundingBox.bottomRightCoordinates;

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
