import mongoose, { Schema } from 'mongoose';
import { UserInfoSchema } from './user-info.model';
import { CommentTypeSchema } from './comment-type.model';
import { CheckinStatusTypeSchema } from './checkin-status-type.model';
import { Comment } from '@common/types/comment';
import { DocumentId } from '@common/types/mongo';

export interface CommentDocument extends Comment, DocumentId {
  PoiID: string;
}

export const CommentSchema: Schema<CommentDocument> = new Schema<CommentDocument>({
  _id: String,
  PoiID: { type: String, required: true, index: true },
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

export const CommentModel = mongoose.model<CommentDocument>('Comment', CommentSchema);
