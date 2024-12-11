import { UserInfo } from '@common/types/user';
import { Schema } from 'mongoose';

export const UserInfoSchema: Schema<UserInfo> = new Schema<UserInfo>(
  {
    ID: { type: Number, required: true, unique: true },
    Username: { type: String, required: true },
    ReputationPoints: { type: Number, required: true },
    ProfileImageURL: { type: String, required: true }
  },
  { _id: false }
);
