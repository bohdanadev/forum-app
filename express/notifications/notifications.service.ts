import { PipelineStage, Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { NotificationModel } from '../../models/schemas/notification.schema';
import { ApiError } from '../api-error/api-error';
import { UserModel } from '../../models/schemas/user.schema';

class NotificationService {
  public async createNotification(
    recipientId: string,
    actorId: string,
    message: string,
    postId: string,
    commentId?: string,
  ) {
    if (recipientId === actorId) {
      return null;
    }

    const notification = new NotificationModel({
      recipient: new Types.ObjectId(recipientId),
      actor: new Types.ObjectId(actorId),
      message,
      post: new Types.ObjectId(postId),
      comment: commentId ? new Types.ObjectId(commentId) : null,
    });

    await UserModel.findByIdAndUpdate(recipientId, {
      $push: { notifications: notification._id },
    });

    return await notification.save();
  }

  public async getNotificationsForUser(
    userId: string,
    { limit, offset },
  ): Promise<[any, number]> {
    const notifications = await NotificationModel.find({
      recipient: new Types.ObjectId(userId),
    })
      .populate('actor', 'id username avatarUrl')
      .populate('post', 'id title')
      .populate('comment', 'id content')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await NotificationModel.countDocuments({
      recipient: new Types.ObjectId(userId),
    });

    return [notifications, total];
  }

  public async getNotificationsForUserQuery(userId: string, { limit, offset }) {
    const pipeline: PipelineStage[] = [
      { $match: { recipient: userId } },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },

      {
        $lookup: {
          from: 'users',
          localField: 'actor',
          foreignField: '_id',
          as: 'actor',
        },
      },
      { $unwind: '$actor' },

      {
        $lookup: {
          from: 'posts',
          localField: 'post',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: { path: '$post', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'comments',
          localField: 'comment',
          foreignField: '_id',
          as: 'comment',
        },
      },
      { $unwind: { path: '$comment', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'actor.id': 1,
          'actor.username': 1,
          'actor.avatarUrl': 1,
          'post.id': 1,
          'post.title': 1,
          'comment.id': 1,
          'comment.content': 1,
          message: 1,
          isRead: 1,
          createdAt: 1,
        },
      },
    ];

    const notifications = await NotificationModel.aggregate(pipeline);

    const total = await NotificationModel.countDocuments({ recipient: userId });

    return [notifications, total];
  }

  public async markAsRead(notificationId: string) {
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      throw new ApiError('Notification not found', HttpStatus.NOT_FOUND);
    }

    notification.isRead = true;
    return await notification.save();
  }
}

export const notificationService = new NotificationService();
