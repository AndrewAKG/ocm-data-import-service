import { v4 as uuidv4 } from 'uuid';
import { main } from '../../services/producer.service';
import { DataPartitionDocument, PartitionService } from '../../types/data-partitioning';
import * as partitionService from '../../services/bounding-box-partitioning.service';
import { TransformedReferenceData } from '@common/types/transformers';
import { commonConfig } from '@common/config/config';
import { ReferenceDataResponse } from '@common/types/ocm-api';
import { QueueService } from '@common/types/queue';
import { IngestionService } from '@common/types/ingestion';
import * as dbConnect from '@common/db/connect';
import * as queueService from '@common/services/queue.service';
import * as transformationService from '@common/services/transformation.service';
import * as ingestionService from '@common/services/ingestion.service';
import * as ocmApiService from '@common/services/ocm-api.service';

jest.mock('../../services/bounding-box-partitioning.service');
jest.mock('@common/db/connect');
jest.mock('@common/services/ingestion.service');
jest.mock('@common/services/ocm-api.service');
jest.mock('@common/utils/mongoose');
jest.mock('@common/services/queue.service');

describe('Producer Service', () => {
  const mockQueueService: jest.Mocked<QueueService> = {
    connectToQueue: jest.fn().mockResolvedValue({
      channel: {
        sendToQueue: jest.fn(),
        waitForConfirms: jest.fn().mockResolvedValue(null),
        close: jest.fn()
      },
      connection: {
        close: jest.fn()
      }
    }),
    sendMessage: jest.fn(),
    closeQueueConnection: jest.fn(),
    consumeMessages: jest.fn()
  };

  const mockPartitionService: jest.Mocked<PartitionService> = {
    getDataPartitions: jest.fn(),
    checkForUpdatedPartitions: jest.fn(),
    partitionData: jest.fn()
  };

  const mockIngestionService: jest.Mocked<IngestionService> = {
    ingestReferenceData: jest.fn(),
    ingestDataPartitions: jest.fn(),
    ingestPOIData: jest.fn()
  };

  const mockDataPartitions: DataPartitionDocument[] = [
    { _id: uuidv4(), dataHash: 'hash1', topLeftCoordinates: [0, 0], bottomRightCoordinates: [0, 0] },
    { _id: uuidv4(), dataHash: 'hash2', topLeftCoordinates: [0, 0], bottomRightCoordinates: [0, 0] }
  ];

  const mockReferenceData: ReferenceDataResponse = {
    ChargerTypes: [],
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

  const mockTransformedReferenceData: TransformedReferenceData = {
    ChargerTypes: [],
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

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(queueService, 'createRabbitMQQueueService').mockReturnValue(mockQueueService);
    jest.spyOn(partitionService, 'createBoundingBoxPartitioningService').mockReturnValue(mockPartitionService);
    jest.spyOn(ingestionService, 'createIngestionService').mockReturnValue(mockIngestionService);
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockResolvedValueOnce(mockReferenceData);
    jest.spyOn(transformationService, 'transformReferenceData').mockReturnValueOnce(mockTransformedReferenceData);
  });

  it('should initialize the producer service and process partitions successfully', async () => {
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: [],
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: [{ partitionParams: { boundingbox: '' } }]
    });

    await main();

    expect(dbConnect.connectToDB).toHaveBeenCalled();
    expect(ocmApiService.fetchOcmReferenceData).toHaveBeenCalled();
    expect(transformationService.transformReferenceData).toHaveBeenCalledWith(mockReferenceData);
    expect(mockIngestionService.ingestReferenceData).toHaveBeenCalledWith(mockTransformedReferenceData);
    expect(mockPartitionService.getDataPartitions).toHaveBeenCalled();
    expect(mockPartitionService.checkForUpdatedPartitions).toHaveBeenCalledWith(
      mockDataPartitions,
      commonConfig.maxResultsPerApiCall
    );
    expect(mockQueueService.connectToQueue).toHaveBeenCalled();
    expect(mockQueueService.sendMessage).toHaveBeenCalled();
    expect(mockQueueService.closeQueueConnection).toHaveBeenCalled();
  });

  it('should partition data when no existing partitions are found', async () => {
    mockPartitionService.getDataPartitions.mockResolvedValueOnce([]);
    mockPartitionService.partitionData.mockResolvedValueOnce({
      dataPartitionsInsertions: mockDataPartitions,
      messages: [{ partitionParams: { boundingbox: '' } }]
    });

    await main();

    expect(mockPartitionService.partitionData).toHaveBeenCalledWith(commonConfig.maxResultsPerApiCall);
    expect(mockQueueService.sendMessage).toHaveBeenCalled();
    expect(mockQueueService.closeQueueConnection).toHaveBeenCalled();
  });

  it('should handle bulk operations for data partitions', async () => {
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockResolvedValueOnce(mockReferenceData);
    jest.spyOn(transformationService, 'transformReferenceData').mockReturnValueOnce(mockTransformedReferenceData);
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: mockDataPartitions,
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: []
    });

    await main();

    expect(mockIngestionService.ingestDataPartitions).toHaveBeenCalledWith(mockDataPartitions, [], []);
  });
});
