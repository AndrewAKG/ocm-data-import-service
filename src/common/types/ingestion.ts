import { DataPartition, DataPartitionDocument } from '@producer/types/data-partitioning';
import { TransformedPOIData, TransformedReferenceData } from './transformers';

export interface IngestionService {
  /**
   * Ingests reference data into corresponding collections using bulk upserts.
   * @param transformedData The transformed reference data to be ingested.
   */
  ingestReferenceData: (transformedData: TransformedReferenceData) => Promise<void>;

  /**
   * Performs bulk operations (insertions, updates, deletions) on data partitions.
   * @param dataPartitionsInsertions The partitions to be inserted.
   * @param dataPartitionsUpdates The partitions to be updated.
   * @param dataPartitionsDeletions The partitions to be deleted.
   */
  ingestDataPartitions: (
    dataPartitionsInsertions: DataPartition[],
    dataPartitionsUpdates: DataPartitionDocument[],
    dataPartitionsDeletions: DataPartitionDocument[]
  ) => Promise<void>;

  /**
   * Ingests POI (Point of Interest) data, including associated comments, connections, and media items.
   * Handles large datasets by processing in chunks.
   * @param transformedData The transformed POI data to be ingested.
   */
  ingestPOIData: (transformedData: TransformedPOIData) => Promise<void>;
}
