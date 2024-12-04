import mongoose, { Schema, Document, Types } from 'mongoose';

import { IUser } from '../interfaces/user.interface';

export interface IPostDoc extends Document {
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: IUser;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDoc>(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    imageUrl: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

PostSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const PostModel = mongoose.model<IPostDoc>('Post', PostSchema);
