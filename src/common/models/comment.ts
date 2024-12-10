import mongoose, { Schema, Document } from 'mongoose';
import { UserInfoSchema } from './user-info';
import { CommentTypeSchema } from './comment-type';
import { CheckinStatusTypeSchema } from './checkin-status-type';
import { Comment } from '@common/types/comment';

type CommentDocument = Comment & Document;

const CommentSchema: Schema<CommentDocument> = new Schema<CommentDocument>({
  ID: { type: String, required: true },
  ChargePointID: { type: Number, required: true },
  CommentTypeID: { type: Number, required: true },
  CommentType: { type: CommentTypeSchema, required: true },
  UserName: { type: String, required: true },
  Comment: { type: String, required: true },
  RelatedURL: { type: String, required: false },
  DateCreated: { type: String, required: true },
  User: { type: UserInfoSchema, required: true },
  CheckinStatusTypeID: { type: Number, required: true },
  CheckinStatusType: { type: CheckinStatusTypeSchema, required: true }
});

const CommentModel = mongoose.model<CommentDocument>('Comment', CommentSchema);
export { CommentSchema, CommentModel };
