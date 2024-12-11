import { MediaItemDocument } from '@common/models';
import { MediaItem } from '@common/types/media-item';

export const transformMediaItem = (PoiID: string, mediaItem: MediaItem): MediaItemDocument => ({
  ...mediaItem,
  _id: mediaItem.ID,
  PoiID: PoiID
});
