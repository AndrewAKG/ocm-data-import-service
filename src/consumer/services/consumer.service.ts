import { connectToDB } from '@common/db/connect';
import { QueueMessage, QueueService } from '@common/types/queue';
import { ProcessorService } from '../types/processor';
import { Message } from 'amqplib';

export const createConsumerService = (queueService: QueueService, processorService: ProcessorService) => {
  return {
    main: async () => {
      console.log('Consumer Service Started');
      await connectToDB();

      const { connection, channel } = await queueService.connectToQueue();

      // Consume messages
      await queueService.consumeMessages(channel, async (msg: Message) => {
        const parsedMessage: QueueMessage = JSON.parse(msg.content.toString());
        console.log('Received message:', JSON.stringify(parsedMessage, null, 2));
        await processorService.processMessage(parsedMessage);
        console.log('message processed successfully', JSON.stringify(parsedMessage, null, 2));
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await queueService.closeQueueConnection(connection);
        process.exit(0);
      });
    }
  };
};
