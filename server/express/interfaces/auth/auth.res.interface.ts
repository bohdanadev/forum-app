import { IUser } from '../user/user.interface';

export interface IUserRes
  extends Pick<
    IUser,
    'username' | 'email' | 'avatarUrl' | 'createdAt' | 'notifications'
  > {
  id: string;
}

export interface IAuthResponse {
  access_token: string;
  user: IUserRes;
}
