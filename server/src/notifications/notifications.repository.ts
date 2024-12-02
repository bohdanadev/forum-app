import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Notification } from '../../models/entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  async findNotificationsByRecipient(userId: string): Promise<Notification[]> {
    return this.find({
      where: { recipient: { id: userId } },
      relations: ['actor', 'post', 'comment'],
      order: { createdAt: 'DESC' },
    });
  }
}
