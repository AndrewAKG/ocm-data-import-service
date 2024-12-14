import { QueueMessage } from '@common/types/queue';

export interface ProcessorService {
  /**
   * Processes a queue message to fetch, transform, and ingest POI data.
   * @param message - The message containing partition parameters for fetching POI data.
   */
  processMessage(message: QueueMessage): Promise<void>;
}
