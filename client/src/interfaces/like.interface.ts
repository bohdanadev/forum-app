import { IUser } from './user.interface';

export interface ILike {
  id: number;
  author: Pick<IUser, 'id' | 'username'>;
}
