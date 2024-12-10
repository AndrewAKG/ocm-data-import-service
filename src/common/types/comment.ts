import { UserInfo } from './user';

interface CommentType {
  ID: number;
  Title: string;
}

interface CheckinStatusType {
  ID: number;
  Title: string;
  IsAutomatedCheckin: boolean;
  IsPositive: boolean;
}

interface Comment {
  ID: string;
  ChargePointID: number;
  CommentTypeID: number;
  CommentType: CommentType;
  UserName: string;
  Comment: string;
  RelatedURL: string;
  DateCreated: string;
  User: UserInfo;
  CheckinStatusTypeID: number;
  CheckinStatusType: CheckinStatusType;
}

export { Comment, CommentType, CheckinStatusType };
