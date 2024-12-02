import { IComment } from './comment.interface';
import { ILike } from './like.interface';
import { IUser } from './user.interface';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Pick<IUser, 'id' | 'username' | 'createdAt' | 'avatarUrl'>;
  likes: ILike[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
