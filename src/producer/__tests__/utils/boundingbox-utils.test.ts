import { constructBoundingBoxParam, subdivideBoundingBox } from '../../utils/boundingbox-utils';
import { BoundingBox } from '../../types/data-partitioning';

describe('BoundingBox Utils', () => {
  describe('constructBoundingBoxParam', () => {
    it('should construct the correct bounding box parameter string for given coordinates', () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10]
      };

      const result = constructBoundingBoxParam(boundingBox);
      expect(result).toBe('(50,-10),(10,10)');
    });
  });

  describe('subdivideBoundingBox', () => {
    it('should split the bounding box horizontally if latitude difference is greater', () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10]
      };

      const result = subdivideBoundingBox(boundingBox);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { topLeftCoordinates: [50, -10], bottomRightCoordinates: [30, 10] },
        { topLeftCoordinates: [30, -10], bottomRightCoordinates: [10, 10] }
      ]);
    });

    it('should split the bounding box vertically if longitude difference is greater', () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [10, -50],
        bottomRightCoordinates: [-10, 50]
      };

      const result = subdivideBoundingBox(boundingBox);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { topLeftCoordinates: [10, -50], bottomRightCoordinates: [-10, 0] },
        { topLeftCoordinates: [10, 0], bottomRightCoordinates: [-10, 50] }
      ]);
    });
  });
});
