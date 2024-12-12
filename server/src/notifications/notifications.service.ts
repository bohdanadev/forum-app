import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { NotificationRepository } from './notifications.repository';
import { User } from '../../models/entities/user.entity';
import { Post } from '../../models/entities/post.entity';
import { Comment } from '../../models/entities/comment.entity';
import { NotificationsListQueryDto } from '../../models/dto/notification/notifications-query.dto';
import { Notification } from '../../models/entities/notification.entity';
import { IUser } from '../../models/interfaces/user.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    recipient: User,
    actor: IUser,
    message: string,
    post?: Post,
    comment?: Comment,
  ): Promise<Notification> {
    if (recipient.id === actor.id) return;

    const notification = this.notificationRepository.create({
      recipient: {
        id: recipient.id,
        username: recipient.username,
        avatarUrl: recipient.avatarUrl,
      },
      actor: {
        id: actor.id,
        username: actor.username,
        avatarUrl: actor.avatarUrl,
      },
      message,
      post,
      comment,
    });

    return this.notificationRepository.save(notification);
  }

  async getNotificationsForUser(
    userId: string,
    query: NotificationsListQueryDto,
  ): Promise<[Notification[], number]> {
    return this.notificationRepository.findNotificationsByRecipient(
      userId,
      query,
    );
  }

  async getNotificationsForUserQuery(
    userId: string,
    query: NotificationsListQueryDto,
  ): Promise<[Notification[], number]> {
    return this.notificationRepository.findNotificationsByRecipientQuery(
      userId,
      query,
    );
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
    });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }
}
