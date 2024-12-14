import { DataProviderDocument } from '@common/models/data-provider.model';
import { DataProvider } from '@common/types/data-provider';

export const transformDataProvider = (dataProvider: DataProvider): DataProviderDocument => {
  const { ID, ...rest } = dataProvider;
  return {
    ...rest,
    _id: ID
  };
};
