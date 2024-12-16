import { DocumentId } from '@common/types/mongo';
import { SubmissionStatus } from '@common/types/poi';
import mongoose, { Schema } from 'mongoose';

export type SubmissionStatusDocument = Omit<SubmissionStatus, 'ID'> & DocumentId;

export const SubmissionStatusSchema: Schema<SubmissionStatusDocument> = new Schema<SubmissionStatusDocument>(
  {
    _id: Number,
    Title: { type: String, required: true },
    IsLive: { type: Boolean, required: true }
  },
  { collection: 'submission_status_types' }
);

export const SubmissionStatusModel = mongoose.model<SubmissionStatusDocument>(
  'SubmissionStatus',
  SubmissionStatusSchema
);
