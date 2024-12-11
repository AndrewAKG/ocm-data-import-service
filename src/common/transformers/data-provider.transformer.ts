import { DataProviderDocument } from '@common/models/data-provider.model';
import { DataProvider } from '@common/types/data-provider';

export const transformDataProvider = (dataProvider: DataProvider): DataProviderDocument => ({
  ...dataProvider,
  _id: dataProvider.ID
});
