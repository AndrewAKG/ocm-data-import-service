interface BoundingBox {
  id?: string;
  topLeftCoordinates: [number, number];
  bottomRightCoordinates: [number, number];
  dataHash?: string; // Hash of the data within this bounding box
  lastUpdated?: number; // Unix Timestamp for the last time this partition was updated
}

export { BoundingBox };
