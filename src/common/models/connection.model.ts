import mongoose, { Schema } from 'mongoose';
import { Connection } from '@common/types/connection';
import { ConnectionTypeSchema } from './connection-type.model';
import { StatusTypeSchema } from './status-type.model';
import { ChargerType } from '@common/types/charger-type';
import { ChargerTypeSchema } from './charger-type.model';
import { SupplyTypeSchema } from './supply-type.model';

export interface ConnectionDocument extends Connection {
  _id: number;
  PoiID: string;
  ChargerTypeID: number;
  ChargerType: ChargerType;
}

export const ConnectionSchema: Schema = new Schema<ConnectionDocument>({
  _id: Number,
  PoiID: { type: String, required: true, index: true },
  ConnectionTypeID: { type: Number, required: true },
  ConnectionType: { type: ConnectionTypeSchema, required: true },
  Reference: { type: String, default: null },
  StatusTypeID: { type: Number, required: true },
  StatusType: { type: StatusTypeSchema, required: true },
  ChargerTypeID: { type: Number, required: true },
  ChargerType: { type: ChargerTypeSchema, required: true },
  Amps: { type: Number, required: true },
  Voltage: { type: Number, required: true },
  PowerKW: { type: Number, required: true },
  CurrentTypeID: { type: Number, required: true },
  CurrentType: { type: SupplyTypeSchema, required: true },
  Quantity: { type: Number, required: true },
  Comments: { type: String, required: true }
});

export const ConnectionModel = mongoose.model<ConnectionDocument>('Connection', ConnectionSchema);
