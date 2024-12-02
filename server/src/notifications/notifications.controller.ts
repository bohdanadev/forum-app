import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { NotificationService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { IUser } from '../../models/interfaces/user.interface';
import { NotificationsListQueryDto } from '../../models/dto/notification/notifications-query.dto';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('v1.1')
  async getNotifications(
    @Query() query: NotificationsListQueryDto,
    @CurrentUser() user: IUser,
  ) {
    const [data, total] =
      await this.notificationService.getNotificationsForUser(user.id, query);
    return { data, total, ...query };
  }

  @UseGuards(JwtAuthGuard)
  @Get('v1.2')
  async getNotificationsQuery(
    @Query() query: NotificationsListQueryDto,
    @CurrentUser() user: IUser,
  ) {
    const [data, total] =
      await this.notificationService.getNotificationsForUserQuery(
        user.id,
        query,
      );
    return { data, total, ...query };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }
}
