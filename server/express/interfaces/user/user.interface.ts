import { Types } from 'mongoose';

import { INotificationDoc } from '../../../models/schemas/notification.schema';

export interface IUser {
  _id?: string | Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  notifications?: INotificationDoc[] | Types.ObjectId[];
}
