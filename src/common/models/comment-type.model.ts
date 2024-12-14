import { CommentType } from '@common/types/comment';
import { DocumentId } from '@common/types/mongo';
import mongoose, { Schema } from 'mongoose';

export type CommentTypeDocument = CommentType & DocumentId;

export const CommentTypeSchema: Schema<CommentTypeDocument> = new Schema<CommentTypeDocument>(
  {
    _id: Number,
    Title: { type: String, required: true }
  },
  { collection: 'comment_types' }
);

export const CommentTypeModel = mongoose.model<CommentTypeDocument>('CommentType', CommentTypeSchema);
