import { INotification } from './notification.interface';

export interface IUser {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  avatarUrl: string;
  notifications?: INotification[];
}
