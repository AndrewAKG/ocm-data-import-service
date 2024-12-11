import { SubmissionStatus } from '@common/types/poi';
import mongoose, { Schema, Document } from 'mongoose';

type SubmissionStatusDocument = SubmissionStatus & Document;

export const SubmissionStatusSchema: Schema<SubmissionStatusDocument> = new Schema<SubmissionStatusDocument>({
  _id: Number,
  Title: { type: String, required: true },
  IsLive: { type: Boolean, required: true }
});

export const SubmissionStatusModel = mongoose.model<SubmissionStatusDocument>(
  'SubmissionStatus',
  SubmissionStatusSchema
);
