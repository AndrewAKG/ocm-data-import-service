import { UserInfo } from './user';

interface MediaItem {
  ID: string;
  ChargePointID: string;
  ItemURL: string;
  ItemThumbnailURL: string;
  Comment: string;
  IsEnabled: boolean;
  IsVideo: boolean;
  IsFeaturedItem: boolean;
  IsExternalResource: boolean;
  User: UserInfo;
  DateCreated: string;
}

export { MediaItem };
