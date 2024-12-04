import mongoose, { Document, Schema, Types } from 'mongoose';

import { IUser } from '../interfaces/user.interface';

export interface IComment extends Document {
  content: string;
  author: IUser;
  post: Types.ObjectId;
  parentComment?: Types.ObjectId;
  likes: Types.ObjectId[];
  replies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
