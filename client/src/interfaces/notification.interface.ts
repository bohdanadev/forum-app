import { IComment } from './comment.interface';
import { IPost } from './post.interface';
import { IUser } from './user.interface';

export interface INotification {
  id: number | string;
  message: string;
  isRead: boolean;
  recipient: IUser;
  actor: Partial<IUser>;
  post?: IPost | null;
  comment?: IComment | null;
  createdAt: Date;
}
