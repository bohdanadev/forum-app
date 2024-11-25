import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { userService } from './users.service';
import { UserResDto } from '../../models/dto/user.res.dto';
import { IUser } from '../../models/interfaces/user.interface';
import { UserMapper } from '../../utils/user-mapper';

class UserController {
  public async getList(
    req: Request,
    res: Response,
  ): Promise<Response<UserResDto[]>> {
    const result = await userService.getListModel();
    return res.status(HttpStatus.OK).json(result);
  }

  public async getListQuery(
    req: Request,
    res: Response,
  ): Promise<Response<UserResDto[]>> {
    const result = await userService.getListQuery();
    return res.status(HttpStatus.OK).json(result);
  }

  public async getUserById(
    req: Request,
    res: Response,
  ): Promise<Response<UserResDto>> {
    const id = req.params.userId;
    const userId = req.res.locals.jwtPayload.userId as string;
    const user = await userService.getById(id);
    const result =
      id === userId
        ? UserMapper.toResponseDTO(user)
        : UserMapper.toUserPublicData(user);
    return res.json(result);
  }

  public async getUserByIdQuery(
    req: Request,
    res: Response,
  ): Promise<Response<UserResDto>> {
    const id = req.params.userId;
    const userId = req.res.locals.jwtPayload.userId as string;
    const user = await userService.getByIdQuery(id);
    const result =
      id === userId
        ? UserMapper.toResponseDTO(user)
        : UserMapper.toUserPublicData(user);
    return res.json(result);
  }

  public async updateUserData(
    req: Request,
    res: Response,
  ): Promise<Response<UserResDto>> {
    const userId = req.res.locals.jwtPayload.userId as string;
    const dto = req.body as IUser;
    const updatedUserData = await userService.update(userId, dto);
    return res.status(HttpStatus.CREATED).json(updatedUserData);
  }

  public async deleteUserProfile(
    req: Request,
    res: Response,
  ): Promise<Response<void>> {
    const userId = req.res.locals.jwtPayload.userId as string;
    await userService.delete(userId);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}

export const userController = new UserController();
