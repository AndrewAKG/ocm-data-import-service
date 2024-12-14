import amqp, { Connection, Message, ConfirmChannel } from 'amqplib';
import { QueueService } from '../types/queue';

/**
 * Factory function to create a queue service.
 * Provides methods to connect to queue, send message to queue, consume messages and close connection.
 */
export const createRabbitMQQueueService = (queueUri: string, queueName: string): QueueService => {
  return {
    // Connect to the queue
    connectToQueue: async () => {
      const connection = await amqp.connect(queueUri);
      const channel = await connection.createConfirmChannel();
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
    sendMessage: (channel: ConfirmChannel, message: string) => {
      channel.sendToQueue(queueName, Buffer.from(message), { persistent: true }, (err) => {
        if (err) {
          console.error('Failed to send message:', err);
        } else {
          console.log(`Message sent to queue "${queueName}": ${message}`);
        }
      });
    },

    // Consume messages from the queue
    consumeMessages: async (channel: ConfirmChannel, onMessage: (msg: Message) => void) => {
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
