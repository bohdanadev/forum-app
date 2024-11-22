import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  // ParseUUIDPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpReqDto } from '../../models/dto/signUp.req.dto';
import { UserResDto } from '../../models/dto/user.res.dto';
import { Public } from '../auth/public.decorator';
import { IUser } from '../../models/interfaces/user.interface';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserMapper } from '../../utils/user-mapper';
import { Response } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('v1.1')
  async getList(@Query() query: any, @Res() res: Response): Promise<any> {
    const users = this.usersService.findAll();
    res.status(HttpStatus.OK).json(users);
  }
  @Get('v1.1/:userId')
  async getUserById(
    @Param('userId') userId: string,
    @CurrentUser() user: IUser,
  ): Promise<IUser | Partial<IUser>> {
    const userData = await this.usersService.findOneById(userId);
    return user.id === userData.id
      ? UserMapper.toResponseDTO(userData)
      : UserMapper.toUserPublicData(userData);
  }
  @Get('v1.2')
  async getListQuery(): Promise<IUser[]> {
    return this.usersService.findAllQuery();
  }

  @Get('v1.2/:userId')
  async getUserByIdQuery(@Param('userId') userId: string): Promise<IUser> {
    return this.usersService.findOneByIdQuery(userId);
  }
}
