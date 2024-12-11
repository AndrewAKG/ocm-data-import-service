import { ConnectionDocument } from '@common/models/connection.model';
import { Connection } from '@common/types/connection';

export const transformConnection = (connection: Connection): ConnectionDocument => ({
  ...connection,
  _id: connection.ID
});
