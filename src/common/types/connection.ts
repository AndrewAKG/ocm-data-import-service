import { ChargerType } from './charger-type';
import { StatusType } from './status-types';
import { SupplyType } from './supply-type';

interface ConnectionType {
  FormalName: string;
  IsDiscontinued: boolean;
  IsObsolete: boolean;
  ID: number;
  Title: string;
}

interface Connection {
  ID: number;
  ConnectionTypeID: number;
  ConnectionType: ConnectionType;
  Reference?: string | null;
  StatusTypeID: number;
  StatusType: StatusType;
  LevelID: number;
  Level: ChargerType;
  Amps: number;
  Voltage: number;
  PowerKW: number;
  CurrentTypeID: number;
  CurrentType: SupplyType;
  Quantity: number;
  Comments: string;
}

export { Connection, ConnectionType };
