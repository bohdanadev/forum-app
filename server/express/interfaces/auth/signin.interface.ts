import { IUser } from '../user/user.interface';

export interface ISignIn extends Pick<IUser, 'password'> {
  identifier: string;
}
