import { ConnectionTypeDocument, ConnectionDocument } from '@common/models';
import { Connection, ConnectionType } from '@common/types/connection';

export const transformConnectionType = (connectionType: ConnectionType): ConnectionTypeDocument => {
  const { ID, ...rest } = connectionType;
  return {
    ...rest,
    _id: ID
  };
};

export const transformConnection = (PoiID: string, connection: Connection): ConnectionDocument => {
  const { ID, Level, LevelID, ...rest } = connection;
  return {
    ...rest,
    _id: ID,
    PoiID,
    ChargerType: Level,
    ChargerTypeID: LevelID
  };
};
