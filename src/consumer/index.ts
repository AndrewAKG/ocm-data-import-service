import dotenv from 'dotenv';
import { connectToDB } from '@common/db/connect';
import { createRabbitMQQueueService } from '@common/services/queue.service';
import { commonConfig } from '@common/config/config';
import { QueueMessage } from '@common/types/queue';
import { processMessage } from './services/message-processor.service';

dotenv.config();
const queueService = createRabbitMQQueueService(commonConfig.queueUri, commonConfig.queueName);

(async () => {
  console.log('Consumer Service Started');
  await connectToDB();

  const message: QueueMessage = {
    partitionParams: { boundingbox: '(-90,0),(0,90)' }
  };

  await processMessage(message);
  // const { connection, channel } = await queueService.connectToQueue();

  // // Consume messages
  // await queueService.consumeMessages(channel, (msg: Message) => {
  //   console.log('Received message:', msg);
  // });

  // // Graceful shutdown
  // process.on('SIGINT', async () => {
  //   await queueService.closeQueueConnection(connection);
  //   process.exit(0);
  // });
})();
