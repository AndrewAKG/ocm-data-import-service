import { CommentType } from '@common/types/comment';
import mongoose, { Schema, Document } from 'mongoose';

type CommentTypeDocument = CommentType & Document;

const CommentTypeSchema: Schema<CommentTypeDocument> = new Schema<CommentTypeDocument>({
  _id: Number,
  Title: { type: String, required: true }
});

const CommentTypeModel = mongoose.model<CommentTypeDocument>('CommentType', CommentTypeSchema);
export { CommentTypeSchema, CommentTypeModel };
