import { CommentType } from '@common/types/comment';
import mongoose, { Schema } from 'mongoose';

export type CommentTypeDocument = CommentType & { _id: number };

export const CommentTypeSchema: Schema<CommentTypeDocument> = new Schema<CommentTypeDocument>({
  _id: Number,
  Title: { type: String, required: true }
});

export const CommentTypeModel = mongoose.model<CommentTypeDocument>('CommentType', CommentTypeSchema);
