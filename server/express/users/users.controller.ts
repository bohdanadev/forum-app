import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { userService } from './users.service';
import { IUserRes } from '../interfaces/auth/auth.res.interface';
import { IUser } from '../interfaces/user/user.interface';
import { UserMapper } from '../../utils/user-mapper';

class UserController {
  public async getUserById(
    req: Request,
    res: Response,
  ): Promise<Response<IUserRes>> {
    const id = req.params.id;
    const userId = req.user.id as string;
    const user = await userService.getById(id);
    const result = id === userId ? user : UserMapper.toUserPublicData(user);
    return res.json(result);
  }

  public async getUserByIdQuery(
    req: Request,
    res: Response,
  ): Promise<Response<IUserRes>> {
    const id = req.params.id;
    const userId = req.user.id as string;
    const user = await userService.getByIdQuery(id);
    const result = id === userId ? user : UserMapper.toUserPublicData(user);
    return res.json(result);
  }

  public async updateUserData(
    req: Request,
    res: Response,
  ): Promise<Response<IUserRes>> {
    const userId = req.user.id as string;
    const dto = req.body as IUser;
    const updatedUserData = await userService.update(userId, dto);
    return res.status(HttpStatus.CREATED).json(updatedUserData);
  }

  public async deleteUserProfile(
    req: Request,
    res: Response,
  ): Promise<Response<void>> {
    const userId = req.user.id as string;
    await userService.delete(userId);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}

export const userController = new UserController();
