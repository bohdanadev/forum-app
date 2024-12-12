import { IUser } from './user.interface';

export interface IComment {
  id: number;
  content: string;
  author: Pick<IUser, 'id' | 'username' | 'avatarUrl'>;
  replies?: IComment[];
  likes: { id: string; authorId: string }[];
  createdAt: string;
}
