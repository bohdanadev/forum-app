import mongoose, { Schema, Document, Types } from 'mongoose';

import { UserInterface } from './post.schema';

export interface INotificationDoc extends Document {
  id?: string;
  recipient: UserInterface;
  actor: UserInterface;
  message: string;
  post: Types.ObjectId;
  comment: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDoc>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const NotificationModel = mongoose.model<INotificationDoc>(
  'Notification',
  notificationSchema,
);
