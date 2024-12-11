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
  MediaItemModel,
  CommentDocument,
  ConnectionDocument,
  MediaItemDocument
} from '../models';
import { TransformedPOIData, TransformedReferenceData } from '../types/transformers';
import { bulkWrite, upsertOneBulkOperation } from '../utils/mongoose';

export const ingestReferenceData = async (transformedData: TransformedReferenceData): Promise<void> => {
  try {
    // Perform bulk upserts for each transformed data type
    await bulkWrite(ChargerTypeModel, transformedData.ChargerTypes.map(upsertOneBulkOperation));
    await bulkWrite(ConnectionTypeModel, transformedData.ConnectionTypes.map(upsertOneBulkOperation));
    await bulkWrite(CheckinStatusTypeModel, transformedData.CheckinStatusTypes.map(upsertOneBulkOperation));
    await bulkWrite(CountryModel, transformedData.Countries.map(upsertOneBulkOperation));
    await bulkWrite(SupplyTypeModel, transformedData.CurrentTypes.map(upsertOneBulkOperation));
    await bulkWrite(DataProviderModel, transformedData.DataProviders.map(upsertOneBulkOperation));
    await bulkWrite(OperatorModel, transformedData.Operators.map(upsertOneBulkOperation));
    await bulkWrite(StatusTypeModel, transformedData.StatusTypes.map(upsertOneBulkOperation));
    await bulkWrite(SubmissionStatusModel, transformedData.SubmissionStatusTypes.map(upsertOneBulkOperation));
    await bulkWrite(UsageTypeModel, transformedData.UsageTypes.map(upsertOneBulkOperation));
    await bulkWrite(CommentTypeModel, transformedData.UserCommentTypes.map(upsertOneBulkOperation));

    console.log('Bulk upsert of transformed data complete.');
  } catch (error) {
    console.error('Error during bulk upsert:', error);
  }
};

export const ingestPOIData = async (transformedData: TransformedPOIData): Promise<void> => {
  let splicedData;

  while (transformedData.length) {
    splicedData = transformedData.splice(0, 10000);
    const POIs = splicedData.map((td) => td.POI);
    const comments = splicedData.reduce((acc: CommentDocument[], curr) => {
      acc = acc.concat(curr.Comments);
      return acc;
    }, []);

    const connections = splicedData.reduce((acc: ConnectionDocument[], curr) => {
      acc = acc.concat(curr.Connections);
      return acc;
    }, []);

    const mediaItems = splicedData.reduce((acc: MediaItemDocument[], curr) => {
      acc = acc.concat(curr.MediaItems);
      return acc;
    }, []);

    await bulkWrite(POIModel, POIs.map(upsertOneBulkOperation));
    await bulkWrite(CommentModel, comments.map(upsertOneBulkOperation));
    await bulkWrite(ConnectionModel, connections.map(upsertOneBulkOperation));
    await bulkWrite(MediaItemModel, mediaItems.map(upsertOneBulkOperation));
  }
};
