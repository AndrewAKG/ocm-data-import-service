import mongoose, { Schema } from 'mongoose';

// Interface to define the structure of the bounding box document
export interface BoundingBox {
  topLeftCoordinates: [number, number];
  bottomRightCoordinates: [number, number];
  dataHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema
const BoundingBoxSchema = new Schema<BoundingBox>(
  {
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
