import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPostDoc extends Document {
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Types.ObjectId;
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

export const PostModel = mongoose.model<IPostDoc>('Post', PostSchema);
