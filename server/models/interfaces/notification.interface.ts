import { Types } from 'mongoose';

import { UserInterface } from '../schemas/post.schema';

export interface INotification {
  _id: number | string;
  recipient: UserInterface;
  actor: UserInterface;
  message: string;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
