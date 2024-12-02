import { INotification } from '../../interfaces/notification.interface';
import { NotificationsListQueryDto } from './notifications-query.dto';

export class NotificationsListResDto extends NotificationsListQueryDto {
  data: INotification[];
  total: number;
}
