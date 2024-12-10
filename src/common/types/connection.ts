import { StatusType } from './status-types';

interface ConnectionType {
  FormalName: string;
  IsDiscontinued: boolean;
  IsObsolete: boolean;
  ID: number;
  Title: string;
}

interface ChargerType {
  ID: number;
  Title: string;
  Comments: string;
  IsFastChargeCapable: boolean;
}

interface SupplyType {
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

export { Connection, ConnectionType, SupplyType, ChargerType };
