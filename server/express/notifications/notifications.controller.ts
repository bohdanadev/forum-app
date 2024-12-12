import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { notificationService } from './notifications.service';
import { INotificationDoc } from '../../models/schemas/notification.schema';
import { INotificationsRes } from '../interfaces/notifications/notifications.res.interface';

class NotificationController {
  public async getNotificationsForUser(
    req: Request,
    res: Response,
  ): Promise<Response<INotificationsRes>> {
    const userId = req.user.id as string;
    const limit = +req.query.limit || 5;
    const offset = +req.query.offset || 0;

    const [notifications, total] =
      await notificationService.getNotificationsForUser(userId, {
        limit,
        offset,
      });
    const data = notifications.map((notification) => ({
      ...notification,
      id: notification._id.toString(),
      actor: notification.actor
        ? {
            id: notification.actor.id,
            username: notification.actor.username,
            avatarUrl: notification.actor.avatarUrl,
          }
        : null,
      post: notification.post
        ? {
            id: notification.post.id,
            title: notification.post.title,
          }
        : null,
      comment: notification.comment
        ? {
            id: notification.comment.id,
            content: notification.comment.content,
          }
        : null,
    }));
    return res.status(HttpStatus.OK).json({ data, total, limit, offset });
  }

  public async getNotificationsForUserQuery(
    req: Request,
    res: Response,
  ): Promise<Response<INotificationsRes>> {
    const userId = req.user.id as string;
    const limit = +req.query.limit || 5;
    const offset = +req.query.offset || 0;
    const [notifications, total] =
      await notificationService.getNotificationsForUser(userId, {
        limit,
        offset,
      });

    const data = notifications.map((notification) => ({
      ...notification,
      id: notification._id.toString(),
      actor: notification.actor
        ? {
            id: notification.actor.id,
            username: notification.actor.username,
            avatarUrl: notification.actor.avatarUrl,
          }
        : null,
      post: notification.post
        ? {
            id: notification.post.id,
            title: notification.post.title,
          }
        : null,
      comment: notification.comment
        ? {
            id: notification.comment.id,
            content: notification.comment.content,
          }
        : null,
    }));

    return res.status(HttpStatus.OK).json({ data, total, limit, offset });
  }

  public async markAsRead(
    req: Request,
    res: Response,
  ): Promise<Response<INotificationDoc>> {
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id);
    return res.status(HttpStatus.OK).json(notification);
  }
}

export const notificationController = new NotificationController();
