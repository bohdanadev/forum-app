import { IUserRes } from '../express/interfaces/auth/auth.res.interface';

declare global {
  namespace Express {
    interface User extends IUserRes {}
    interface Request {
      user?: IUserRes;
    }
  }
}
