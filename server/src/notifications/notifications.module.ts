import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from '../../models/entities/notification.entity';
import { PostgresModule } from '../postgres/postgres.module';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { NotificationRepository } from './notifications.repository';

@Module({
  imports: [PostgresModule, TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationsModule {}
