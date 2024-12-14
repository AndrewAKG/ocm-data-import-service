import { MongoMemoryServer } from 'mongodb-memory-server';
import { RabbitMQContainer, StartedRabbitMQContainer } from '@testcontainers/rabbitmq';
import { EventEmitter } from 'events';
import { Model } from 'mongoose';

import { createProducerService } from '@producer/services/producer.service';
import { createConsumerService } from '@consumer/services/consumer.service';
import { createRabbitMQQueueService } from '@common/services/rabbitmq.service';
import { createBoundingBoxPartitioningService } from '@producer/services/bounding-box-partitioning.service';
import { createTransformService } from '@common/services/transform.service';
import { createIngestionService } from '@common/services/ingestion.service';
import { createProcesserService } from '@consumer/services/processor.service';
import { connectToDB } from '@common/utils/db.utils';
import { DataPartitionModel } from '@producer/models/data-partition.model';
import { OcmApiService, POIDataResponse, ReferenceDataResponse } from '@common/types/ocm-api';
import {
  ChargerTypeModel,
  ConnectionModel,
  DataProviderModel,
  OperatorModel,
  POIModel,
  StatusTypeModel
} from '@common/models';
import mockReferenceData from '@mocks/reference-data.json';
import mockPoiData from '@mocks/poi.json';
import { QueueService } from '@common/types/queue';

describe('E2E: Producer to Consumer to DB', () => {
  let mongoServer: MongoMemoryServer;
  let rabbitMQContainer: StartedRabbitMQContainer;

  let consumerService: ReturnType<typeof createConsumerService>;
  let consumerQueueService: QueueService;

  let producerService: ReturnType<typeof createProducerService>;
  let producerQueueService: QueueService;

  const mockOcmApiService: jest.Mocked<OcmApiService> = {
    fetchOcmPoiData: jest.fn(),
    fetchOcmReferenceData: jest.fn()
  };

  const eventEmitter = new EventEmitter();

  beforeAll(async () => {
    // Start MongoDB memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connectToDB(mongoUri);

    // Start RabbitMQ container
    rabbitMQContainer = await new RabbitMQContainer()
      .withEnvironment({
        DEBUG: 'testcontainers*'
      })
      .start();
    const queueUri = rabbitMQContainer.getAmqpUrl();
    console.log(queueUri);
    const queueName = 'test-queue';

    // Initialize services
    consumerQueueService = createRabbitMQQueueService(queueUri, queueName);
    producerQueueService = createRabbitMQQueueService(queueUri, queueName);

    const partitionService = createBoundingBoxPartitioningService(mockOcmApiService, 10);
    const transformService = createTransformService();
    const ingestionService = createIngestionService();
    const processorService = createProcesserService(mockOcmApiService, transformService, ingestionService);

    producerService = createProducerService(
      mockOcmApiService,
      partitionService,
      transformService,
      ingestionService,
      producerQueueService
    );

    consumerService = createConsumerService(consumerQueueService, {
      ...processorService,
      processMessage: async (message) => {
        await processorService.processMessage(message);

        // Emit custom event when a message is processed
        eventEmitter.emit('message-processed');
      }
    });
  }, 120000); // adjust based on your network to pull the docker image

  afterAll(async () => {
    await consumerQueueService.closeQueueConnection();
    await rabbitMQContainer.stop();
    await mongoServer.stop();
  });

  it('should partition data, send message, process message, and ingest into DB', async () => {
    mockOcmApiService.fetchOcmReferenceData.mockResolvedValue(mockReferenceData as ReferenceDataResponse);
    mockOcmApiService.fetchOcmPoiData.mockResolvedValue(mockPoiData as POIDataResponse);

    // Start consumer service
    consumerService.main();

    // Start producer service
    producerService.main();

    // Wait for the custom event to be emitted
    await new Promise<void>((resolve) => eventEmitter.once('message-processed', () => resolve()));

    // Verify DB records
    const models: Model<any>[] = [
      DataPartitionModel,
      POIModel,
      ConnectionModel,
      ChargerTypeModel,
      StatusTypeModel,
      DataProviderModel,
      OperatorModel
    ];
    for (const model of models) {
      const data = await model.find({});
      expect(data).toHaveLength(1);
    }
  }, 10000);
});
