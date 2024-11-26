import { IUser } from '../models/interfaces/user.interface';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: IUser;
    }
  }
}
