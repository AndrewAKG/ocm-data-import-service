import { CheckinStatusType } from '@common/types/comment';
import mongoose, { Schema, Document } from 'mongoose';

type CheckinStatusTypeDocument = CheckinStatusType & Document;

const CheckinStatusTypeSchema: Schema<CheckinStatusTypeDocument> = new Schema<CheckinStatusTypeDocument>({
  _id: Number,
  Title: { type: String, required: true },
  IsAutomatedCheckin: { type: Boolean, required: true },
  IsPositive: { type: Boolean, required: true }
});

const CheckinStatusTypeModel = mongoose.model<CheckinStatusTypeDocument>('CheckinStatusType', CheckinStatusTypeSchema);
export { CheckinStatusTypeSchema, CheckinStatusTypeModel };
