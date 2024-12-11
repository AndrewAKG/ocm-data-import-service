import { ConnectionTypeDocument, ConnectionDocument } from '@common/models';
import { Connection, ConnectionType } from '@common/types/connection';

export const transformConnectionType = (connectionType: ConnectionType): ConnectionTypeDocument => ({
  ...connectionType,
  _id: connectionType.ID
});

export const transformConnection = (PoiID: string, connection: Connection): ConnectionDocument => ({
  ...connection,
  _id: connection.ID,
  PoiID
});
