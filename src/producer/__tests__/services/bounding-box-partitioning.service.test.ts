import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createBoundingBoxPartitioningService } from '../../services/bounding-box-partitioning.service';
import { DataPartitionModel } from '../../models/data-partition.model';
import { generateDataHash } from '../../utils/hashing.utils';
import { DataPartitionDocument } from '../../types/data-partitioning';
import { fetchOcmPoiData } from '@common/services/ocm-api.service';

jest.mock('@common/services/ocm-api.service');
jest.mock('../../utils/hashing-utils');

const mockFetchOcmPoiData = fetchOcmPoiData as jest.Mock;
const mockGenerateDataHash = generateDataHash as jest.Mock;

const maxResults = 10;

describe('BoundingBoxPartitioningService', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }, 50000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupService = () => createBoundingBoxPartitioningService();

  describe('getDataPartitions', () => {
    it('should fetch all data partitions from the database', async () => {
      const service = setupService();

      const mockPartitions: DataPartitionDocument[] = [
        new DataPartitionModel({
          _id: uuidv4(),
          dataHash: 'hash1',
          topLeftCoordinates: [10, 20],
          bottomRightCoordinates: [30, 40]
        }),
        new DataPartitionModel({
          _id: uuidv4(),
          dataHash: 'hash2',
          topLeftCoordinates: [50, 60],
          bottomRightCoordinates: [70, 80]
        })
      ];
      await DataPartitionModel.insertMany(mockPartitions);

      const result = await service.getDataPartitions();

      expect(result).toHaveLength(2);
      expect(result[0].dataHash).toBe('hash1');
      expect(result[1].dataHash).toBe('hash2');
    });
  });

  describe('checkForUpdatedPartitions', () => {
    it('should handle data hash mismatches and create update messages', async () => {
      const service = setupService();

      const existingPartitions: DataPartitionDocument[] = [
        new DataPartitionModel({
          _id: uuidv4(),
          dataHash: 'oldHash',
          topLeftCoordinates: [10, 20],
          bottomRightCoordinates: [30, 40]
        })
      ];
      await DataPartitionModel.insertMany(existingPartitions);

      mockFetchOcmPoiData.mockResolvedValue(new Array(maxResults / 2));
      mockGenerateDataHash.mockReturnValue('newHash');

      const updatesResult = await service.checkForUpdatedPartitions(existingPartitions, maxResults);
      const messages = updatesResult.messages;
      const dataPartitionsUpdates = updatesResult.dataPartitionsUpdates as DataPartitionDocument[];

      expect(dataPartitionsUpdates).toHaveLength(1);
      expect(dataPartitionsUpdates[0].dataHash).toBe('newHash');
      expect(messages).toHaveLength(1);
    });

    it('should handle data increase and generate sub-partitions', async () => {
      const service = setupService();

      const existingPartitions: DataPartitionDocument[] = [
        {
          _id: uuidv4(),
          dataHash: 'oldHash',
          topLeftCoordinates: [10, 20],
          bottomRightCoordinates: [30, 40]
        }
      ];

      mockFetchOcmPoiData.mockResolvedValueOnce(new Array(maxResults));
      mockFetchOcmPoiData.mockResolvedValue(new Array(maxResults / 2));

      const { dataPartitionsInsertions, dataPartitionsDeletions, messages } = await service.checkForUpdatedPartitions(
        existingPartitions,
        maxResults
      );

      expect(dataPartitionsInsertions).toHaveLength(2);
      expect(dataPartitionsDeletions).toHaveLength(1);
      expect(messages).toHaveLength(2);
    });
  });

  describe('partitionData', () => {
    it('should generate bounding boxes and create partition data', async () => {
      const service = setupService();

      mockFetchOcmPoiData.mockResolvedValue(new Array(maxResults / 2));
      mockGenerateDataHash.mockReturnValue('dataHash');

      const { dataPartitionsInsertions, messages } = await service.partitionData(maxResults);

      expect(dataPartitionsInsertions).toHaveLength(1);
      expect(dataPartitionsInsertions[0].dataHash).toBe('dataHash');
      expect(messages).toHaveLength(1);
    });
  });
});
