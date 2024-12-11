import { ConnectionTypeDocument } from '@common/models/connection-type.model';
import { ConnectionType } from '@common/types/connection';

export const transformConnectionType = (connectionType: ConnectionType): ConnectionTypeDocument => ({
  ...connectionType,
  _id: connectionType.ID
});
