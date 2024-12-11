import mongoose, { Schema } from 'mongoose';
import { Connection } from '@common/types/connection';

export type ConnectionDocument = Connection & { _id: number; PoiID: string };

export const ConnectionSchema: Schema = new Schema<ConnectionDocument>({
  _id: Number,
  PoiID: { type: String, required: true },
  ConnectionTypeID: { type: Number, required: true },
  Reference: { type: String, default: null },
  StatusTypeID: { type: Number, required: true },
  LevelID: { type: Number, required: true },
  Amps: { type: Number, required: true },
  Voltage: { type: Number, required: true },
  PowerKW: { type: Number, required: true },
  CurrentTypeID: { type: Number, required: true },
  Quantity: { type: Number, required: true },
  Comments: { type: String, required: true }
});

export const ConnectionModel = mongoose.model<ConnectionDocument>('Connection', ConnectionSchema);
