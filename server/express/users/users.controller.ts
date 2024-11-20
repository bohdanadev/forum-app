import { NextFunction, Request, Response } from 'express';
import { userService } from './users.service';

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getListModel();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getListQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getListQuery();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
