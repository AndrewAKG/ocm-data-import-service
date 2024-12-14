import amqp, { Connection, Message, ConfirmChannel } from 'amqplib';
import { QueueService } from '../types/queue';

/**
 * Factory function to create a queue service.
 * Provides methods to connect to queue, send messages, consume messages, and close connection.
 */
export const createRabbitMQQueueService = (queueUri: string, queueName: string): QueueService => {
  let connection: Connection | null = null;
  let channel: ConfirmChannel | null = null;
  let isClosedIntentionally = false;

  const connectToQueue = async () => {
    try {
      connection = await amqp.connect(queueUri);

      connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        connection = null;
      });

      connection.on('close', () => {
        if (isClosedIntentionally) {
          console.log('RabbitMQ connection closed intentionally.');
        } else {
          console.warn('RabbitMQ connection closed unexpectedly. Attempting to reconnect...');
          connection = null;
          setTimeout(connectToQueue, 5000); // Retry connection after 5 seconds
        }
      });

      channel = await connection.createConfirmChannel();
      await channel.assertQueue(queueName, { durable: true });

      console.log(`Connected to RabbitMQ queue: ${queueName}`);
    } catch (err) {
      console.error('Failed to connect to RabbitMQ:', err);
      setTimeout(connectToQueue, 5000); // Retry connection after 5 seconds
    }
  };

  const closeQueueConnection = async () => {
    isClosedIntentionally = true; // Set the flag to indicate intentional closure
    if (connection) {
      try {
        await connection.close();
        console.log('RabbitMQ connection closed intentionally');
      } catch (err) {
        console.error('Error closing RabbitMQ connection:', err);
      }
    }
  };

  const sendMessage = (message: string) => {
    if (!channel) {
      console.error('RabbitMQ channel is not available. Message not sent:', message);
      return;
    }

    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true }, (err) => {
      if (err) {
        console.error('Failed to send message:', err);
      } else {
        console.log(`Message sent to queue "${queueName}": ${message}`);
      }
    });
  };

  const waitForConfirms = async () => {
    if (!channel) {
      console.error('RabbitMQ channel is not available. Cannot wait for confirm messages.');
      return;
    }
    await channel.waitForConfirms();
  };

  const consumeMessages = async (onMessage: (msg: Message) => void) => {
    if (!channel) {
      console.error('RabbitMQ channel is not available. Cannot consume messages.');
      return;
    }

    try {
      console.log(`Waiting for messages in queue: ${queueName}`);
      await channel.consume(
        queueName,
        (msg) => {
          if (msg) {
            try {
              onMessage(msg);
              channel?.ack(msg);
            } catch (err) {
              console.error('Error processing message:', err);
              channel?.nack(msg, false, true); // Requeue message on failure
            }
          }
        },
        { noAck: false }
      );
    } catch (err) {
      console.error('Error consuming messages:', err);
    }
  };

  return {
    connectToQueue,
    closeQueueConnection,
    sendMessage,
    consumeMessages,
    waitForConfirms
  };
};
