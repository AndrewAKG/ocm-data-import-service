import { v4 as uuidv4 } from 'uuid';
import { ConfirmChannel, Connection } from 'amqplib';
import { main } from '../../services/producer.service';
import { DataPartitionDocument, PartitionService } from '../../types/data-partitioning';
import { DataPartitionModel } from '../../models/data-partition.model';
import * as partitionService from '../../services/bounding-box-partitioning.service';
import { TransformedReferenceData } from '@common/types/transformers';
import { commonConfig } from '@common/config/config';
import { ReferenceDataResponse } from '@common/types/ocm-api';
import { QueueService } from '@common/types/queue';
import * as dbConnect from '@common/db/connect';
import * as queueService from '@common/services/queue.service';
import * as transformationService from '@common/services/transformation.service';
import * as ingestionService from '@common/services/ingestion.service';
import * as ocmApiService from '@common/services/ocm-api.service';
import * as mongooseUtils from '@common/utils/mongoose';

jest.mock('../../services/bounding-box-partitioning.service');
jest.mock('@common/db/connect');
jest.mock('@common/services/queue.service');
jest.mock('@common/services/ingestion.service');
jest.mock('@common/services/ocm-api.service');
jest.mock('@common/utils/mongoose');

describe('Producer Service', () => {
  const mockQueueService: jest.Mocked<QueueService> = {
    connectToQueue: jest.fn(),
    sendMessage: jest.fn(),
    closeQueueConnection: jest.fn(),
    consumeMessages: jest.fn()
  };

  const mockPartitionService: jest.Mocked<PartitionService> = {
    getDataPartitions: jest.fn(),
    checkForUpdatedPartitions: jest.fn(),
    partitionData: jest.fn()
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
    DataTypes: [],
    MetadataGroups: null,
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
  });

  it('should initialize the producer service and process partitions successfully', async () => {
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockResolvedValueOnce(mockReferenceData);
    jest.spyOn(transformationService, 'transformReferenceData').mockReturnValueOnce(mockTransformedReferenceData);
    jest.spyOn(ingestionService, 'ingestReferenceData').mockResolvedValueOnce();
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: [],
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: [{ partitionParams: { boundingbox: '' } }]
    });
    mockQueueService.connectToQueue.mockResolvedValueOnce({ channel: {}, connection: {} } as {
      channel: ConfirmChannel;
      connection: Connection;
    });

    await main();

    expect(dbConnect.connectToDB).toHaveBeenCalled();
    expect(ocmApiService.fetchOcmReferenceData).toHaveBeenCalled();
    expect(transformationService.transformReferenceData).toHaveBeenCalledWith(mockReferenceData);
    expect(ingestionService.ingestReferenceData).toHaveBeenCalledWith(mockTransformedReferenceData);
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
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockResolvedValueOnce(mockReferenceData);
    jest.spyOn(transformationService, 'transformReferenceData').mockReturnValueOnce(mockTransformedReferenceData);
    jest.spyOn(ingestionService, 'ingestReferenceData').mockResolvedValueOnce();
    mockPartitionService.getDataPartitions.mockResolvedValueOnce([]);
    mockPartitionService.partitionData.mockResolvedValueOnce({
      dataPartitionsInsertions: mockDataPartitions,
      messages: [{ partitionParams: { boundingbox: '' } }]
    });
    mockQueueService.connectToQueue.mockResolvedValueOnce({ channel: {}, connection: {} } as {
      channel: ConfirmChannel;
      connection: Connection;
    });

    await main();

    expect(mockPartitionService.partitionData).toHaveBeenCalledWith(commonConfig.maxResultsPerApiCall);
    expect(mockQueueService.sendMessage).toHaveBeenCalled();
    expect(mockQueueService.closeQueueConnection).toHaveBeenCalled();
  });

  it('should handle errors during reference data ingestion', async () => {
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockRejectedValueOnce(new Error('Failed to fetch data'));

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`Process exited with code ${code}`);
    });

    await expect(main()).rejects.toThrow('Process exited with code 1');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(mockPartitionService.getDataPartitions).not.toHaveBeenCalled();
  });

  it('should handle empty messages array gracefully', async () => {
    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockResolvedValueOnce(mockReferenceData);
    jest.spyOn(transformationService, 'transformReferenceData').mockReturnValueOnce(mockTransformedReferenceData);
    jest.spyOn(ingestionService, 'ingestReferenceData').mockResolvedValueOnce();
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: [],
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: []
    });

    await main();

    expect(mockQueueService.connectToQueue).not.toHaveBeenCalled();
    expect(mockQueueService.sendMessage).not.toHaveBeenCalled();
  });

  it('should handle bulk operations for data partitions', async () => {
    const bulkWriteSpy = jest.spyOn(mongooseUtils, 'bulkWrite').mockResolvedValueOnce();

    jest.spyOn(dbConnect, 'connectToDB').mockResolvedValueOnce();
    jest.spyOn(ocmApiService, 'fetchOcmReferenceData').mockResolvedValueOnce(mockReferenceData);
    jest.spyOn(transformationService, 'transformReferenceData').mockReturnValueOnce(mockTransformedReferenceData);
    jest.spyOn(ingestionService, 'ingestReferenceData').mockResolvedValueOnce();
    mockPartitionService.getDataPartitions.mockResolvedValueOnce(mockDataPartitions);
    mockPartitionService.checkForUpdatedPartitions.mockResolvedValueOnce({
      dataPartitionsInsertions: mockDataPartitions,
      dataPartitionsUpdates: [],
      dataPartitionsDeletions: [],
      messages: []
    });

    await main();

    expect(bulkWriteSpy).toHaveBeenCalledTimes(3);
    expect(bulkWriteSpy).toHaveBeenCalledWith(DataPartitionModel, expect.any(Array));
  });
});
