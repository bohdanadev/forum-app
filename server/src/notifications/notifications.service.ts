import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationRepository } from './notifications.repository';
import { User } from '../../models/entities/user.entity';
import { Post } from '../../models/entities/post.entity';
import { Comment } from '../../models/entities/comment.entity';
import { UserResDto } from '../../models/dto/user.res.dto';
import { NotificationsListQueryDto } from '../../models/dto/notification/notifications-query.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    recipient: Partial<UserResDto>,
    actor: User,
    message: string,
    post?: Post,
    comment?: Comment,
  ) {
    if (recipient.id === actor.id) return;

    const notification = this.notificationRepository.create({
      recipient,
      actor,
      message,
      post,
      comment,
    });

    return this.notificationRepository.save(notification);
  }

  async getNotificationsForUser(
    userId: string,
    query: NotificationsListQueryDto,
  ) {
    return this.notificationRepository.findNotificationsByRecipient(
      userId,
      query,
    );
  }

  async getNotificationsForUserQuery(
    userId: string,
    query: NotificationsListQueryDto,
  ) {
    return this.notificationRepository.findNotificationsByRecipientQuery(
      userId,
      query,
    );
  }

  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
    });
    if (!notification) throw new Error('Notification not found');
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }
}
