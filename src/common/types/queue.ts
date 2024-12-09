import { Connection, Channel, Message } from 'amqplib';

export interface QueueService {
  connectToQueue: () => Promise<{ connection: Connection; channel: Channel }>;
  closeQueueConnection: (connection: Connection) => Promise<void>;
  sendMessage: (channel: Channel, message: string) => void;
  consumeMessages: (channel: Channel, onMessage: (msg: Message | null) => void) => Promise<void>;
}

export interface QueueMessage {
  boundingBoxQueryParam: string;
}
