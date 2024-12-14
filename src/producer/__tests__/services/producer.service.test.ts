import { v4 as uuidv4 } from 'uuid';
import { createProducerService } from '../../services/producer.service';
import { DataPartitionDocument, PartitionService } from '../../types/data-partitioning';
import { OCMApiService } from '@common/types/ocm-api';
import { QueueService } from '@common/types/queue';
import { IngestionService } from '@common/types/ingestion';
import { TransformService } from '@common/types/transform';
import { constructPartitionParams } from '../../utils/boundingbox.utils';
import * as partitionService from '../../services/bounding-box-partitioning.service';
import * as dbConnect from '@common/db/connect';
import * as queueService from '@common/services/queue.service';
import * as transformService from '@common/services/transform.service';
import * as ingestionService from '@common/services/ingestion.service';
import * as ocmApiService from '@common/services/ocm-api.service';

jest.mock('../../services/bounding-box-partitioning.service');
jest.mock('@common/db/connect');
jest.mock('@common/services/ingestion.service');
jest.mock('@common/services/ocm-api.service');
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

  const mockOCMApiService: jest.Mocked<OCMApiService> = {
    fetchOcmPoiData: jest.fn(),
    fetchOcmReferenceData: jest.fn()
  };

  const mockPartitionService: jest.Mocked<PartitionService> = {
    getDataPartitions: jest.fn(),
    checkForUpdatedPartitions: jest.fn(),
    partitionData: jest.fn()
  };

  const mockTransformService: jest.Mocked<TransformService> = {
    transformReferenceData: jest.fn(),
    transformPOIData: jest.fn()
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

  const producerService = createProducerService(
    mockOCMApiService,
    mockPartitionService,
    mockTransformService,
    mockIngestionService,
    mockQueueService
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(queueService, 'createRabbitMQQueueService').mockReturnValue(mockQueueService);
    jest.spyOn(partitionService, 'createBoundingBoxPartitioningService').mockReturnValue(mockPartitionService);
    jest.spyOn(ingestionService, 'createIngestionService').mockReturnValue(mockIngestionService);
    jest.spyOn(ocmApiService, 'createOcmApiService').mockReturnValue(mockOCMApiService);
    jest.spyOn(transformService, 'createTransformService').mockReturnValue(mockTransformService);
  });

  it('should initialize the producer service and process partitions successfully', async () => {
    const boundingBoxParitionParams = constructPartitionParams(mockDataPartitions[0]);
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: [],
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: [{ partitionParams: boundingBoxParitionParams }]
    });

    await producerService.main();

    expect(dbConnect.connectToDB).toHaveBeenCalled();
    expect(mockOCMApiService.fetchOcmReferenceData).toHaveBeenCalled();
    expect(mockTransformService.transformReferenceData).toHaveBeenCalled();
    expect(mockIngestionService.ingestReferenceData).toHaveBeenCalled();
    expect(mockPartitionService.getDataPartitions).toHaveBeenCalled();
    expect(mockPartitionService.checkForUpdatedPartitions).toHaveBeenCalled();
    expect(mockQueueService.connectToQueue).toHaveBeenCalled();
    expect(mockQueueService.sendMessage).toHaveBeenCalled();
    expect(mockQueueService.closeQueueConnection).toHaveBeenCalled();
  });

  it('should partition data when no existing partitions are found', async () => {
    const boundingBoxParitionParams = constructPartitionParams(mockDataPartitions[0]);
    mockPartitionService.getDataPartitions.mockResolvedValueOnce([]);
    mockPartitionService.partitionData.mockResolvedValueOnce({
      dataPartitionsInsertions: mockDataPartitions,
      messages: [{ partitionParams: boundingBoxParitionParams }]
    });

    await producerService.main();

    expect(mockPartitionService.partitionData).toHaveBeenCalled();
    expect(mockQueueService.sendMessage).toHaveBeenCalled();
    expect(mockQueueService.closeQueueConnection).toHaveBeenCalled();
  });

  it('should handle bulk operations for data partitions', async () => {
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: mockDataPartitions,
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: []
    });

    await producerService.main();

    expect(mockIngestionService.ingestDataPartitions).toHaveBeenCalledWith(mockDataPartitions, [], []);
  });
});
