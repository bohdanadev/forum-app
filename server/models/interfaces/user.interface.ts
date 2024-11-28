export interface IUser {
  id?: string;
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  createdAt?: Date;
}
