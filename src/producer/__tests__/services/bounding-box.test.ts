import axios from 'axios';

import { BoundingBox, BoundingBoxModel } from '../../models/BoundingBox';
import { generateBoundingBoxes, validateBoundingBox } from '../../services/bounding-box.service';
import { generateDataHash } from '../../utils/hashing-utils';
import { constructBoundingBoxParam, subdivideBoundingBox } from '../../utils/boundingbox-utils';

jest.mock('axios');
jest.mock('../../models/BoundingBox');
jest.mock('../../utils/hashing-utils');

// Cast to jest.Mock to use mockResolvedValueOnce
const mockedAxiosGet = axios.get as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

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

      mockedAxiosGet.mockResolvedValueOnce({ data: Array(50) });
      (generateDataHash as jest.Mock).mockReturnValue('mockHash'); // Mock hash generation

      await generateBoundingBoxes(boundingBox, maxResults, accumulator);

      expect(accumulator).toHaveLength(1);
      expect(accumulator[0]).toEqual({
        ...boundingBox,
        dataHash: 'mockHash',
        boundingBoxQueryIdentifier: constructBoundingBoxParam(boundingBox)
      });
    });

    it('should subdivide and recurse if results exceed the limit', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10]
      };

      const maxResults = 100;
      const accumulator: BoundingBox[] = [];

      mockedAxiosGet.mockResolvedValueOnce({ data: Array(100) }).mockResolvedValue({ data: Array(50) }); // Mock 50 results for each sub-box
      (generateDataHash as jest.Mock).mockReturnValue('mockHash'); // Mock hash generation

      await generateBoundingBoxes(boundingBox, maxResults, accumulator);

      expect(accumulator).toHaveLength(2); // Should have two subdivided boxes
    });
  });

  describe('validateBoundingBox', () => {
    it('should do nothing if data hash matches and results are within the limit', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10],
        dataHash: 'mockHash'
      };

      mockedAxiosGet.mockResolvedValueOnce({ data: Array(50) }); // Mock 50 results
      (generateDataHash as jest.Mock).mockReturnValue('mockHash'); // Mock hash matches

      const result = await validateBoundingBox(boundingBox, 100);
      expect(result).toBeUndefined(); // Should not process further
    });

    it('should re-process the bounding box if the hash does not match', async () => {
      const boundingBox: BoundingBox = {
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10],
        dataHash: 'oldHash'
      };

      mockedAxiosGet.mockResolvedValueOnce({ data: Array(50) }); // Mock 50 results
      (generateDataHash as jest.Mock).mockReturnValue('newHash'); // Mock new hash

      await validateBoundingBox(boundingBox, 100);

      // TO-DO
      // test send to queue is called
    });

    it('should subdivide, save new boxes, and delete the parent box if results exceed the limit', async () => {
      const boundingBox: BoundingBox = {
        _id: 'mockId',
        topLeftCoordinates: [50, -10],
        bottomRightCoordinates: [10, 10],
        dataHash: 'mockHash'
      };

      mockedAxiosGet
        .mockResolvedValueOnce({ data: Array(200) }) // Mock 200 results for the initial bounding box
        .mockResolvedValue({ data: Array(50) }); // Mock 50 results for each sub-box
      (generateDataHash as jest.Mock).mockReturnValue('mockHash'); // Mock hash generation
      (BoundingBoxModel.deleteOne as jest.Mock).mockResolvedValue({}); // Mock deletion
      (BoundingBoxModel.insertMany as jest.Mock).mockResolvedValue({}); // Mock insertion

      await validateBoundingBox(boundingBox, 100);

      expect(BoundingBoxModel.deleteOne).toHaveBeenCalledWith({ _id: boundingBox._id });
      expect(BoundingBoxModel.insertMany).toHaveBeenCalled();
    });
  });
});
