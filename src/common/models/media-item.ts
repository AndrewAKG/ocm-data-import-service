import { MediaItem } from '@common/types/media-item';
import { UserInfoSchema } from './user-info'; // Import UserInfoSchema
import mongoose, { Schema, Document } from 'mongoose';

type MediaItemDocument = MediaItem & Document;

export const MediaItemSchema: Schema<MediaItemDocument> = new Schema<MediaItemDocument>({
  _id: Number,
  ChargePointID: { type: String, required: true },
  ItemURL: { type: String, required: true },
  ItemThumbnailURL: { type: String, required: true },
  Comment: { type: String, required: false },
  IsEnabled: { type: Boolean, required: true },
  IsVideo: { type: Boolean, required: true },
  IsFeaturedItem: { type: Boolean, required: true },
  IsExternalResource: { type: Boolean, required: true },
  User: { type: UserInfoSchema, required: true },
  DateCreated: { type: String, required: true }
});

export const MediaItemModel = mongoose.model<MediaItemDocument>('MediaItem', MediaItemSchema);
