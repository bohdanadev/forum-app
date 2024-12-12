import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { notificationController } from './notifications.controller';
import { CommonMiddleware } from '../middlewares/common.middleware';
import {
  NotificationModel,
  INotificationDoc,
} from '../../models/schemas/notification.schema';

const router = Router();

export const commonMiddleware = new CommonMiddleware(NotificationModel);

router.get(
  '/v1.1',
  authMiddleware.authCheck,
  tryCatch(notificationController.getNotificationsForUser),
);
router.get(
  '/v1.2',
  authMiddleware.authCheck,
  tryCatch(notificationController.getNotificationsForUserQuery),
);

router.patch(
  '/:id/read',
  authMiddleware.authCheck,
  commonMiddleware.isExist<INotificationDoc>('id'),
  tryCatch(notificationController.markAsRead),
);

export const notificationRouter = router;
