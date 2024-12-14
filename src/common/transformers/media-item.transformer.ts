import { MediaItemDocument } from '@common/models';
import { MediaItem } from '@common/types/media-item';

export const transformMediaItem = (PoiID: string, mediaItem: MediaItem): MediaItemDocument => {
  const { ID, ...rest } = mediaItem;
  return {
    ...rest,
    _id: ID,
    PoiID
  };
};
