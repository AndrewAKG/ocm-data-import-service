import { QueueMessage } from '@common/types/queue';

export interface BoundingBox {
  topLeftCoordinates: [number, number];
  bottomRightCoordinates: [number, number];
}

export interface DataPartition extends BoundingBox {
  dataHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DataPartitionDocument = DataPartition & { _id: string };

interface DataPartitionsOperations {
  dataPartitionsInsertions: DataPartition[];
  dataPartitionsUpdates?: DataPartitionDocument[];
  dataPartitionsDeletions?: DataPartitionDocument[];
  messages: QueueMessage[];
}

export interface PartitionService {
  getDataPartitions: () => Promise<DataPartitionDocument[]>;
  partitionData: (maxResults: number) => Promise<DataPartitionsOperations>;
  checkForUpdatedPartitions: (
    dataPartitions: DataPartitionDocument[],
    maxResults: number
  ) => Promise<DataPartitionsOperations>;
}
