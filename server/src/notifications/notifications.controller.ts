import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';

import { NotificationService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { IUser } from '../../models/interfaces/user.interface';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@CurrentUser() user: IUser) {
    return this.notificationService.getNotificationsForUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(+id);
  }
}
