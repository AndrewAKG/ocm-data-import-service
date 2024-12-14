import { DataPartition, DataPartitionDocument } from 'src/producer/types/data-partitioning';
import {
  ChargerTypeModel,
  ConnectionTypeModel,
  CheckinStatusTypeModel,
  CountryModel,
  SupplyTypeModel,
  DataProviderModel,
  OperatorModel,
  StatusTypeModel,
  SubmissionStatusModel,
  UsageTypeModel,
  CommentTypeModel,
  POIModel,
  CommentModel,
  ConnectionModel,
  MediaItemModel
} from '../models';
import { TransformedPOIData, TransformedReferenceData } from '../types/transformers';
import {
  bulkWrite,
  deleteOneBulkOperation,
  insertOneBulkOperation,
  updateOneBulkOperation,
  upsertOneBulkOperation
} from '../utils/mongoose.utils';
import { DataPartitionModel } from '../../producer/models/data-partition.model';
import { IngestionService } from '../types/ingestion';
import { logError } from '@common/utils/error.utils';

/**
 * Factory function to create an ingestion service.
 * Provides methods to ingest reference data, data partitions, and POI data into MongoDB.
 */
export const createIngestionService = (): IngestionService => {
  /**
   * Helper function to perform bulk upserts for a model and transformed data.
   * @param model Mongoose model to perform the bulk operation on.
   * @param data Transformed data to upsert.
   */
  const performBulkUpsert = async (model: any, data: any[]) => {
    if (data.length > 0) {
      await bulkWrite(model, data.map(upsertOneBulkOperation));
    }
  };

  return {
    /**
     * Ingest reference data into their respective collections via bulk upserts.
     * @param transformedData Transformed reference data to ingest.
     */
    ingestReferenceData: async (transformedData: TransformedReferenceData): Promise<void> => {
      try {
        const bulkOperations = [
          { model: ChargerTypeModel, data: transformedData.ChargerTypes },
          { model: ConnectionTypeModel, data: transformedData.ConnectionTypes },
          { model: CheckinStatusTypeModel, data: transformedData.CheckinStatusTypes },
          { model: CountryModel, data: transformedData.Countries },
          { model: SupplyTypeModel, data: transformedData.CurrentTypes },
          { model: DataProviderModel, data: transformedData.DataProviders },
          { model: OperatorModel, data: transformedData.Operators },
          { model: StatusTypeModel, data: transformedData.StatusTypes },
          { model: SubmissionStatusModel, data: transformedData.SubmissionStatusTypes },
          { model: UsageTypeModel, data: transformedData.UsageTypes },
          { model: CommentTypeModel, data: transformedData.UserCommentTypes }
        ];

        // Perform bulk upserts for all data types
        await Promise.all(bulkOperations.map(({ model, data }) => performBulkUpsert(model, data)));

        console.log('Bulk upsert of transformed reference data complete.');
      } catch (error) {
        logError(error, 'Error during bulk upsert of reference data');
      }
    },

    /**
     * Ingest data partitions (insertions, updates, and deletions) into the database.
     * @param dataPartitionsInsertions Data partitions to insert.
     * @param dataPartitionsUpdates Data partitions to update.
     * @param dataPartitionsDeletions Data partitions to delete.
     */
    ingestDataPartitions: async (
      dataPartitionsInsertions: DataPartition[],
      dataPartitionsUpdates: DataPartitionDocument[],
      dataPartitionsDeletions: DataPartitionDocument[]
    ): Promise<void> => {
      console.log('Performing bulk operations on data partitions...');
      await bulkWrite(DataPartitionModel, dataPartitionsInsertions.map(insertOneBulkOperation));
      await bulkWrite(DataPartitionModel, dataPartitionsUpdates.map(updateOneBulkOperation));
      await bulkWrite(DataPartitionModel, dataPartitionsDeletions.map(deleteOneBulkOperation));
    },

    /**
     * Ingest POI data and related entities into their respective collections.
     * Handles large datasets by processing in chunks.
     * @param transformedData Transformed POI data to ingest.
     */
    ingestPOIData: async (transformedData: TransformedPOIData): Promise<void> => {
      const chunkSize = 10000;

      while (transformedData.length > 0) {
        try {
          const splicedData = transformedData.splice(0, chunkSize);

          // Separate POIs, comments, connections, and media items
          const POIs = splicedData.map((td) => td.POI);
          const comments = splicedData.flatMap((td) => td.Comments);
          const connections = splicedData.flatMap((td) => td.Connections);
          const mediaItems = splicedData.flatMap((td) => td.MediaItems);

          const bulkOperations = [
            { model: POIModel, data: POIs },
            { model: CommentModel, data: comments },
            { model: ConnectionModel, data: connections },
            { model: MediaItemModel, data: mediaItems }
          ];

          // Perform bulk upserts for each entity type
          await Promise.all(bulkOperations.map(({ model, data }) => performBulkUpsert(model, data)));
        } catch (error) {
          logError(error, 'Error in upserting POI data');
        }
      }
      console.log('Bulk upsert of POI data complete.');
    }
  };
};
