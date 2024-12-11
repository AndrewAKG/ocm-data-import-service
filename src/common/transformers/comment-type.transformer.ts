import { CommentTypeDocument } from '@common/models/comment-type.model';
import { CommentType } from '@common/types/comment';

export const transformCommentType = (commentType: CommentType): CommentTypeDocument => ({
  ...commentType,
  _id: commentType.ID
});
