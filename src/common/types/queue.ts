import { Connection, Message, ConfirmChannel } from 'amqplib';
import { OCMApiQueryParams } from './ocm-api';

export interface QueueService {
  connectToQueue: () => Promise<{ connection: Connection; channel: ConfirmChannel }>;
  closeQueueConnection: (connection: Connection) => Promise<void>;
  sendMessage: (channel: ConfirmChannel, message: string) => void;
  consumeMessages: (channel: ConfirmChannel, onMessage: (msg: Message) => void) => Promise<void>;
}

export interface QueueMessage {
  partitionParams: OCMApiQueryParams;
}
