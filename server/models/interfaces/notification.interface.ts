import { Types } from 'mongoose';

import { UserInterface } from '../schemas/post.schema';
import { UserResDto } from '../dto/user.res.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';

export interface INotification {
  // id: number | string;
  // message: string;
  // isRead: boolean;
  // recipient: User;
  // // actor: Partial<UserResDto>;
  // // post?: Post | null;
  // // comment?: Comment | null;
  // createdAt: Date;
  id: number | string;
  // recipient: UserInterface | User;
  recipient: any;
  actor: UserInterface | Partial<UserResDto>;
  message: string;
  post?: Types.ObjectId | Post;
  comment?: Types.ObjectId | Comment;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
