import dotenv from 'dotenv';
import { connectToDB } from '@common/db/connect';
import { createRabbitMQQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { QueueMessage } from '@common/types/queue';
import { processMessage } from './services/message-processor.service';
import { Message } from 'amqplib';

dotenv.config();
const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);

(async () => {
  console.log('Consumer Service Started');
  await connectToDB();

  const { connection, channel } = await queueService.connectToQueue();

  // Consume messages
  await queueService.consumeMessages(channel, async (msg: Message) => {
    const parsedMessage: QueueMessage = JSON.parse(msg.content.toString());
    console.log('Received message:', JSON.stringify(parsedMessage, null, 2));
    await processMessage(parsedMessage);
  });

  // // Graceful shutdown
  process.on('SIGINT', async () => {
    await queueService.closeQueueConnection(connection);
    process.exit(0);
  });
})();
