import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { NotificationService } from './notifications.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { IUser } from '../../models/interfaces/user.interface';
import { NotificationsListQueryDto } from '../../models/dto/notification/notifications-query.dto';
import { Notification } from '../../models/entities/notification.entity';
import { NotificationsListResDto } from '../../models/dto/notification/notifications.res.dto';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('v1.1')
  async getNotifications(
    @Query() query: NotificationsListQueryDto,
    @CurrentUser() user: IUser,
  ): Promise<NotificationsListResDto> {
    const [data, total] =
      await this.notificationService.getNotificationsForUser(user.id, query);
    return { data, total, ...query };
  }

  @Get('v1.2')
  async getNotificationsQuery(
    @Query() query: NotificationsListQueryDto,
    @CurrentUser() user: IUser,
  ): Promise<NotificationsListResDto> {
    const [data, total] =
      await this.notificationService.getNotificationsForUserQuery(
        user.id,
        query,
      );
    return { data, total, ...query };
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Notification> {
    return await this.notificationService.markAsRead(id);
  }
}
