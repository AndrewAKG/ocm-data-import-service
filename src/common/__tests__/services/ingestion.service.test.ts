import { createIngestionService } from '@common/services/ingestion.service';
import {
  CountryDocument,
  ChargerTypeDocument,
  POIDocument,
  CommentDocument,
  ConnectionDocument,
  MediaItemDocument
} from '@common/models';
import { TransformedReferenceData, TransformedPOIData } from '@common/types/transformers';
import * as mongooseUtils from '@common/utils/mongoose.utils';
import * as errorUtils from '@common/utils/error.utils';
import { DataPartition, DataPartitionDocument } from '../../../producer/types/data-partitioning';

jest.mock('@common/utils/mongoose.utils');
jest.mock('@common/utils/error.utils');

describe('Ingestion Service', () => {
  const ingestionService = createIngestionService();

  beforeEach(() => {
    jest.spyOn(mongooseUtils, 'bulkWrite').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ingestReferenceData', () => {
    const mockCountry: CountryDocument = {
      _id: 1,
      ISOCode: 'Mock ISO',
      ContinentCode: 'Mock Code',
      Title: 'Mock Title'
    };

    const mockChargerType: ChargerTypeDocument = {
      _id: 1,
      Title: 'Mock Title',
      Comments: 'Mock Comment',
      IsFastChargeCapable: true
    };

    it('should perform bulk upserts for all reference data types', async () => {
      const transformedData: TransformedReferenceData = {
        ChargerTypes: [mockChargerType],
        ConnectionTypes: [],
        CheckinStatusTypes: [],
        Countries: [mockCountry],
        CurrentTypes: [],
        DataProviders: [],
        Operators: [],
        StatusTypes: [],
        SubmissionStatusTypes: [],
        UsageTypes: [],
        UserCommentTypes: []
      };

      await ingestionService.ingestReferenceData(transformedData);

      expect(mongooseUtils.bulkWrite).toHaveBeenCalledTimes(2); // Only two types had data
    });

    it('should log an error if bulk upserts fail', async () => {
      const transformedData: TransformedReferenceData = {
        ChargerTypes: [mockChargerType],
        ConnectionTypes: [],
        CheckinStatusTypes: [],
        Countries: [],
        CurrentTypes: [],
        DataProviders: [],
        Operators: [],
        StatusTypes: [],
        SubmissionStatusTypes: [],
        UsageTypes: [],
        UserCommentTypes: []
      };

      (mongooseUtils.bulkWrite as jest.Mock).mockRejectedValue(new Error('Mock bulkWrite error'));

      await ingestionService.ingestReferenceData(transformedData);

      expect(errorUtils.logError).toHaveBeenCalledWith(expect.any(Error), 'Error during bulk upsert of reference data');
    });
  });

  describe('ingestDataPartitions', () => {
    const dataPartitionsInsertions: DataPartition[] = [
      { topLeftCoordinates: [0, 0], bottomRightCoordinates: [1, 1], dataHash: 'mockHash1' }
    ];
    const dataPartitionsUpdates: DataPartitionDocument[] = [
      { _id: '2', topLeftCoordinates: [1, 1], bottomRightCoordinates: [2, 2], dataHash: 'mockHash2' }
    ];
    const dataPartitionsDeletions: DataPartitionDocument[] = [
      { _id: '3', topLeftCoordinates: [2, 2], bottomRightCoordinates: [3, 3], dataHash: 'mockHash3' }
    ];

    it('should perform bulk operations on data partitions', async () => {
      await ingestionService.ingestDataPartitions(
        dataPartitionsInsertions,
        dataPartitionsUpdates,
        dataPartitionsDeletions
      );

      expect(mongooseUtils.bulkWrite).toHaveBeenCalledTimes(3);
    });
  });

  describe('ingestPOIData', () => {
    const mockPOI = {} as POIDocument;
    const mockComment = {} as CommentDocument;
    const mockConnection = {} as ConnectionDocument;
    const mockMediaItem = {} as MediaItemDocument;

    const transformedData: TransformedPOIData = [
      {
        POI: mockPOI,
        Comments: [mockComment],
        Connections: [mockConnection],
        MediaItems: [mockMediaItem]
      }
    ];

    it('should process and upsert POI data in chunks', async () => {
      await ingestionService.ingestPOIData([...transformedData]);

      expect(mongooseUtils.bulkWrite).toHaveBeenCalledTimes(4);
    });

    it('should log an error if a bulk upsert fails during chunk processing', async () => {
      (mongooseUtils.bulkWrite as jest.Mock).mockRejectedValue(new Error('Mock mongooseUtils.bulkWrite error'));

      await ingestionService.ingestPOIData([...transformedData]);

      expect(errorUtils.logError).toHaveBeenCalledWith(expect.any(Error), 'Error in upserting POI data');
    });

    it('should handle empty transformed POI data gracefully', async () => {
      await ingestionService.ingestPOIData([]);

      expect(mongooseUtils.bulkWrite).not.toHaveBeenCalled();
      expect(errorUtils.logError).not.toHaveBeenCalled();
    });
  });
});
