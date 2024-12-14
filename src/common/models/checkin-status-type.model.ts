import { CheckinStatusType } from '@common/types/comment';
import { DocumentId } from '@common/types/mongo';
import mongoose, { Schema } from 'mongoose';

export type CheckinStatusTypeDocument = Omit<CheckinStatusType, 'ID'> & DocumentId;

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
