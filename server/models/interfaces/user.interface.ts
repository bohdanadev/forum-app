import { INotificationDoc } from '../schemas/notification.schema';
import { Notification } from '../entities/notification.entity';
import { Types } from 'mongoose';

export interface IUser {
  id?: string;
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  createdAt?: Date;
  notifications?: any;
  // | Partial<Notification>[]
  // | INotificationDoc[]
  // | Types.ObjectId[];
}
