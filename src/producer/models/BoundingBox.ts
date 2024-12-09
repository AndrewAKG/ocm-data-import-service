import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Interface to define the structure of the bounding box document
export interface BoundingBox {
  _id?: string;
  boundingBoxQueryIdentifier?: string;
  topLeftCoordinates: [number, number];
  bottomRightCoordinates: [number, number];
  dataHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema
const BoundingBoxSchema = new Schema<BoundingBox>(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    boundingBoxQueryIdentifier: { type: String, required: true, unique: true },
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
    timestamps: true
  }
);

export const BoundingBoxModel = mongoose.model<BoundingBox>('BoundingBox', BoundingBoxSchema);
