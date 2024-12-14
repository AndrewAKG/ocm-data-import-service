import { Message } from 'amqplib';
import { OCMApiQueryParams } from './ocm-api';

export interface QueueService {
  connectToQueue: () => Promise<void>;
  closeQueueConnection: () => Promise<void>;
  sendMessage: (message: string) => void;
  consumeMessages: (onMessage: (msg: Message) => void) => Promise<void>;
  waitForConfirms: () => Promise<void>;
}

export interface QueueMessage {
  partitionParams: OCMApiQueryParams;
}
