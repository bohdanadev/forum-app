import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { notificationService } from './notifications.service';
import { INotificationDoc } from '../../models/schemas/notification.schema';

class NotificationController {
  public async getNotificationsForUser(
    req: Request,
    res: Response,
  ): Promise<Response<any>> {
    const userId = req.user.id as string;

    const [notifications, total] =
      await notificationService.getNotificationsForUser(userId, {
        limit: +req.query.limit || 10,
        offset: +req.query.offset || 0,
      });
    const data = notifications.map((notification) => ({
      ...notification,
      id: notification._id.toString(),
    }));

    return res.status(HttpStatus.OK).json({ data, total, ...req.query });
  }

  public async getNotificationsForUserQuery(
    req: Request,
    res: Response,
  ): Promise<Response<any>> {
    const userId = req.user.id as string;

    const [notifications, total] =
      await notificationService.getNotificationsForUser(userId, {
        limit: +req.query.limit || 10,
        offset: +req.query.offset || 0,
      });

    const data = notifications.map((notification) => ({
      ...notification,
      id: notification._id.toString(),
    }));

    return res.status(HttpStatus.OK).json({ data, total, ...req.query });
  }

  public async markAsRead(
    req: Request,
    res: Response,
  ): Promise<Response<INotificationDoc>> {
    const { notificationId } = req.params;

    const notification = await notificationService.markAsRead(notificationId);
    return res.status(HttpStatus.OK).json(notification);
  }
}

export const notificationController = new NotificationController();
