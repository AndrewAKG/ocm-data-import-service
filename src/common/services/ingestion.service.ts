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
  CommentTypeModel
} from '@common/models';
import { TransformedReferenceData } from '@common/types/transformers';

const bulkUpsert = async (model: any, data: any[]) => {
  if (!data || data.length === 0) return;

  const operations = data.map((doc) => ({
    updateOne: {
      filter: { _id: doc._id },
      update: { $set: doc },
      upsert: true
    }
  }));

  await model.bulkWrite(operations);
};

export const ingestReferenceData = async (transformedData: TransformedReferenceData): Promise<void> => {
  try {
    // Perform bulk upserts for each transformed data type
    await bulkUpsert(ChargerTypeModel, transformedData.ChargerTypes);
    await bulkUpsert(ConnectionTypeModel, transformedData.ConnectionTypes);
    await bulkUpsert(CheckinStatusTypeModel, transformedData.CheckinStatusTypes);
    await bulkUpsert(CountryModel, transformedData.Countries);
    await bulkUpsert(SupplyTypeModel, transformedData.CurrentTypes);
    await bulkUpsert(DataProviderModel, transformedData.DataProviders);
    await bulkUpsert(OperatorModel, transformedData.Operators);
    await bulkUpsert(StatusTypeModel, transformedData.StatusTypes);
    await bulkUpsert(SubmissionStatusModel, transformedData.SubmissionStatusTypes);
    await bulkUpsert(UsageTypeModel, transformedData.UsageTypes);
    await bulkUpsert(CommentTypeModel, transformedData.UserCommentTypes);

    console.log('Bulk upsert of transformed data complete.');
  } catch (error) {
    console.error('Error during bulk upsert:', error);
  }
};
