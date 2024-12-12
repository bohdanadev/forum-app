import { INotification } from './notification.interface';

export interface IUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  notifications?: number | INotification[];
}
