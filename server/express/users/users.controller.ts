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

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      const result = await userService.create(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
