import { Notification } from '../../entities/notification.entity';
import { NotificationsListQueryDto } from './notifications-query.dto';

export class NotificationsListResDto extends NotificationsListQueryDto {
  data: Notification[];
  total: number;
}
