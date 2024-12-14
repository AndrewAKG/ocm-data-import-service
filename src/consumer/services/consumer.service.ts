import { Message } from 'amqplib';
import { QueueMessage, QueueService } from '@common/types/queue';
import { ProcessorService } from '../types/processor';

export const createConsumerService = (queueService: QueueService, processorService: ProcessorService) => {
  return {
    main: async () => {
      console.log('Consumer Service Started');
      await queueService.connectToQueue();

      // Consume messages
      await queueService.consumeMessages(async (msg: Message) => {
        const parsedMessage: QueueMessage = JSON.parse(msg.content.toString());
        console.log('Received message:', JSON.stringify(parsedMessage, null, 2));
        await processorService.processMessage(parsedMessage);
        console.log('message processed successfully', JSON.stringify(parsedMessage, null, 2));
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await queueService.closeQueueConnection();
        return;
      });
    }
  };
};
