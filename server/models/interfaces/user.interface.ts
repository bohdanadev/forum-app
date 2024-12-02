import { Notification } from '../entities/notification.entity';

export interface IUser {
  id?: string;
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  createdAt?: Date;
  notifications?: Notification[];
}
