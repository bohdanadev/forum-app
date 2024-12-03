import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Notification } from '../../models/entities/notification.entity';
import { DATA_SOURCE } from '../../utils/constants';
import { NotificationsListQueryDto } from '../../models/dto/notification/notifications-query.dto';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    super(Notification, dataSource.manager);
  }
  async findNotificationsByRecipient(
    userId: string,
    query: NotificationsListQueryDto,
  ): Promise<[Notification[], number]> {
    const limit = query.limit || 10;
    const offset = query.offset || 0;

    const [notifications, total] = await this.findAndCount({
      where: { recipient: { id: userId } },
      relations: ['actor', 'post', 'comment'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return [notifications, total];
  }

  async findNotificationsByRecipientQuery(
    userId: string,
    query: NotificationsListQueryDto,
  ): Promise<[Notification[], number]> {
    const limit = query.limit || 10;
    const offset = query.offset || 0;

    const notifications = await this.query(
      `
      SELECT 
        n.*, 
        JSON_BUILD_OBJECT(
          'id', u.id, 
          'username', u.username, 
          'avatarUrl', u."avatarUrl"
        ) AS "actor",
        JSON_BUILD_OBJECT(
          'id', p.id,
          'title', p.title
        ) AS "post",
        JSON_BUILD_OBJECT(
          'id', c.id,
          'content', c.content
        ) AS "comment"
      FROM notification n
      LEFT JOIN "users" u ON n."actorId" = u.id
      LEFT JOIN post p ON n."postId" = p.id
      LEFT JOIN comment c ON n."commentId" = c.id
      WHERE n."recipientId" = $1
      ORDER BY n."createdAt" DESC
      LIMIT $2 OFFSET $3
      `,
      [userId, limit, offset],
    );

    const totalResult = await this.query(
      `
      SELECT COUNT(*) 
      FROM notification 
      WHERE "recipientId" = $1
      `,
      [userId],
    );

    const total = parseInt(totalResult[0].count, 10);

    return [notifications, total];
  }
}
