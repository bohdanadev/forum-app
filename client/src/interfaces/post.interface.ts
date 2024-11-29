import { IUser } from './user.interface';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Pick<IUser, 'id' | 'username' | 'createdAt' | 'avatarUrl'>;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}
