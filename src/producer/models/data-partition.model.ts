import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { DataPartitionDocument } from '../types/data-partitioning';

const DataPartitionSchema = new Schema<DataPartitionDocument>(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    topLeftCoordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (value: [number, number]) => value.length === 2,
        message: 'Top-left coordinates must be an array of 2 numbers [latitude, longitude].'
      }
    },
    bottomRightCoordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (value: [number, number]) => value.length === 2,
        message: 'Bottom-right coordinates must be an array of 2 numbers [latitude, longitude].'
      }
    },
    dataHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'data_partitions'
  }
);

export const DataPartitionModel = mongoose.model<DataPartitionDocument>('DataPartition', DataPartitionSchema);
