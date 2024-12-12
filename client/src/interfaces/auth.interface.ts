export type ISignIn = [identifier: string, password: string];

export interface ISignUp {
  username: string;
  email: string;
  avatarUrl: string;
  password: string;
  confirmPassword: string;
}
