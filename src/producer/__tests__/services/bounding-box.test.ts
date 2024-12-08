import axios from 'axios';
import { BoundingBox } from '../../models/BoundingBox';
import {
  constructBoundingBoxParam,
  fetchResultsCount,
  subdivideBoundingBox,
  generateBoundingBoxes
} from '../../services/bounding-box.service';

jest.mock('axios');

describe('Bounding Box Service', () => {
  describe('constructBoundingBoxParam', () => {
    it('should correctly construct the bounding box query parameter', () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [10, 20],
        bottomRightCoordinates: [30, 40]
      };

      const result = constructBoundingBoxParam(boundingBox);
      expect(result).toBe('(10,20),(30,40)');
    });
  });

  describe('fetchResultsCount', () => {
    it('should return the correct count of results', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [10, 20],
        bottomRightCoordinates: [30, 40]
      };

      const mockResponse = { data: Array(50) }; // Simulating 50 results
      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchResultsCount(boundingBox);
      expect(result).toBe(50);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/poi'), {
        params: {
          boundingbox: '(10,20),(30,40)',
          opendata: true,
          compact: true
        }
      });
    });

    it('should return 0 if an error occurs', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [10, 20],
        bottomRightCoordinates: [30, 40]
      };

      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      const result = await fetchResultsCount(boundingBox);
      expect(result).toBe(0);
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

  describe('generateBoundingBoxes', () => {
    it('should add bounding box to accumulator if results are within the limit', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10]
      };

      const maxResults = 100;
      const accumulator: BoundingBox[] = [];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: Array(50) }); // Mock 50 results

      await generateBoundingBoxes(boundingBox, maxResults, accumulator);

      expect(accumulator).toHaveLength(1);
      expect(accumulator[0]).toEqual(boundingBox);
    });

    it('should subdivide and recurse if results exceed the limit', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10]
      };

      const maxResults = 100;
      const accumulator: BoundingBox[] = [];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: Array(200) }); // Mock 200 results for the initial bounding box
      (axios.get as jest.Mock).mockResolvedValue({ data: Array(50) }); // Mock 50 results for each sub-box

      await generateBoundingBoxes(boundingBox, maxResults, accumulator);

      expect(accumulator).toHaveLength(2); // Should have two subdivided boxes
    });
  });
});
