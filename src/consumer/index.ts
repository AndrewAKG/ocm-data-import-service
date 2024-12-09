import dotenv from 'dotenv';
import { connectToDB } from '@common/db/connect';
import { createQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { Message } from 'amqplib';

dotenv.config();
const queueService = createQueueService(commonConfig.queueUri, commonConfig.queueName);

(async () => {
  console.log('Consumer Service Started');
  await connectToDB();

  const { connection, channel } = await queueService.connectToQueue();

  // Consume messages
  await queueService.consumeMessages(channel, (msg: Message) => {
    console.log('Received message:', msg);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await queueService.closeQueueConnection(connection);
    process.exit(0);
  });
})();
