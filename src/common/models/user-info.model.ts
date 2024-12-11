import { UserInfo } from '@common/types/user';
import { Schema } from 'mongoose';

// Define the schema for UserInfo
export const UserInfoSchema: Schema<UserInfo> = new Schema<UserInfo>(
  {
    ID: { type: Number, required: true, unique: true }, // Unique user ID
    Username: { type: String, required: true }, // User's name
    ReputationPoints: { type: Number, required: true }, // User's reputation points
    ProfileImageURL: { type: String, required: true } // URL to user's profile image
  },
  { _id: false }
);
