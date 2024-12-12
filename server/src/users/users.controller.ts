import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';

import { UsersService } from './users.service';
import { IUser } from '../../models/interfaces/user.interface';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserMapper, UserPublicData } from '../../utils/user-mapper';
import { UserResDto } from '../../models/dto/user/user.res.dto';
import { UserUpdateReqDto } from '../../models/dto/user/user-update.req.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('v1.1/:userId')
  async getUserById(
    @Param('userId') userId: string,
    @CurrentUser() user: IUser,
  ): Promise<UserResDto | UserPublicData> {
    const userData = await this.usersService.findOneById(userId);
    return user.id === userData.id
      ? userData
      : UserMapper.toUserPublicData(userData);
  }

  @Get('v1.2/:userId')
  async getUserByIdQuery(
    @Param('userId') userId: string,
    @CurrentUser() user: IUser,
  ): Promise<UserResDto | UserPublicData> {
    const userData = await this.usersService.findOneByIdQuery(userId);
    return user.id === userData.id
      ? userData
      : UserMapper.toUserPublicData(userData);
  }
  @Put()
  public async updateUser(
    @CurrentUser() user: IUser,
    @Body() dto: UserUpdateReqDto,
  ): Promise<UserResDto> {
    const result = await this.usersService.updateUserProfile(user.id, dto);
    return result;
  }

  @Delete()
  public async deleteUser(@CurrentUser() user: IUser): Promise<void> {
    return await this.usersService.removeUserProfile(user.id);
  }
}
