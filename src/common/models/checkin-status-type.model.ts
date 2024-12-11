import { CheckinStatusType } from '@common/types/comment';
import mongoose, { Schema } from 'mongoose';

export type CheckinStatusTypeDocument = CheckinStatusType & { _id: number };

export const CheckinStatusTypeSchema: Schema<CheckinStatusTypeDocument> = new Schema<CheckinStatusTypeDocument>(
  {
    _id: Number,
    Title: { type: String, required: true },
    IsAutomatedCheckin: { type: Boolean, required: true },
    IsPositive: { type: Boolean, required: true }
  },
  { collection: 'checkin_status_types' }
);

export const CheckinStatusTypeModel = mongoose.model<CheckinStatusTypeDocument>(
  'CheckinStatusType',
  CheckinStatusTypeSchema
);
