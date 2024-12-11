import { INotification } from '../../../models/interfaces/notification.interface';

export interface INotificationsRes {
  data: INotification[];
  total: number;
  limit?: number;
  offset: number;
}
