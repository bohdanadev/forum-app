import { IUser } from '../user/user.interface';

export interface ISignUp
  extends Pick<IUser, 'username' | 'email' | 'avatarUrl' | 'password'> {
  confirmPassword: string;
}
