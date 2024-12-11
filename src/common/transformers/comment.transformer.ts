import { CommentDocument } from '@common/models';
import { CommentTypeDocument } from '@common/models/comment-type.model';
import { Comment, CommentType } from '@common/types/comment';
import { transformCheckinStatusType } from './checkin-status-type.transformer';

export const transformCommentType = (commentType: CommentType): CommentTypeDocument => ({
  ...commentType,
  _id: commentType.ID
});

export const transformComment = (PoiID: string, comment: Comment): CommentDocument => ({
  ...comment,
  _id: comment.ID,
  PoiID: PoiID,
  CommentType: transformCommentType(comment.CommentType),
  CheckinStatusType: transformCheckinStatusType(comment.CheckinStatusType)
});
