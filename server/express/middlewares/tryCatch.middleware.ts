import { NextFunction, Request, Response } from 'express';

type IRes<T> = Promise<Response<T>>;

interface ICbFunction<T> {
  (req: Request, res: Response, next: NextFunction): IRes<T>;
}

export const tryCatch =
  <T>(cb: ICbFunction<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res
        .status(res.statusCode < 400 ? 400 : res.statusCode || 500)
        .json({ message: error.message });
    }
  };
