import { CommentDocument } from '@common/models';
import { CommentTypeDocument } from '@common/models/comment-type.model';
import { Comment, CommentType } from '@common/types/comment';
import { transformCheckinStatusType } from './checkin-status-type.transformer';

export const transformCommentType = (commentType: CommentType): CommentTypeDocument => {
  const { ID, ...rest } = commentType;
  return {
    ...rest,
    _id: ID
  };
};

export const transformComment = (PoiID: string, comment: Comment): CommentDocument => {
  const { ID, ...rest } = comment;
  return {
    ...rest,
    _id: ID,
    PoiID,
    CommentType: transformCommentType(comment.CommentType),
    CheckinStatusType: transformCheckinStatusType(comment.CheckinStatusType)
  };
};
