import amqp, { Connection, Channel, Message } from 'amqplib';
import { QueueService } from '../types/queue';

export const createQueueService = (queueUri: string, queueName: string): QueueService => {
  return {
    // Connect to the queue
    connectToQueue: async () => {
      const connection = await amqp.connect(queueUri);
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, { durable: true });

      console.log(`Connected to RabbitMQ queue: ${queueName}`);
      return { connection, channel };
    },

    // Close the queue connection
    closeQueueConnection: async (connection: Connection) => {
      await connection.close();
      console.log('RabbitMQ connection closed');
    },

    // Send a message to the queue
    sendMessage: (channel: Channel, message: string) => {
      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(`Message sent to queue "${queueName}": ${message}`);
    },

    // Consume messages from the queue
    consumeMessages: async (channel: Channel, onMessage: (msg: Message) => void) => {
      console.log(`Waiting for messages in queue: ${queueName}`);
      await channel.consume(
        queueName,
        (msg) => {
          if (msg) {
            onMessage(msg);
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
    }
  };
};
