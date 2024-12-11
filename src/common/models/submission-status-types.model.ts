import { SubmissionStatus } from '@common/types/poi';
import mongoose, { Schema } from 'mongoose';

export type SubmissionStatusDocument = SubmissionStatus & { _id: number };

export const SubmissionStatusSchema: Schema<SubmissionStatusDocument> = new Schema<SubmissionStatusDocument>(
  {
    _id: Number,
    Title: { type: String, required: true },
    IsLive: { type: Boolean, required: true, index: true }
  },
  { collection: 'submission_status_types' }
);

export const SubmissionStatusModel = mongoose.model<SubmissionStatusDocument>(
  'SubmissionStatus',
  SubmissionStatusSchema
);
