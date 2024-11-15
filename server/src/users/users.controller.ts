import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../models/entities/user.entity';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('v1.1')
  async getList(): Promise<User[]> {
    return this.usersService.findAll();
  }
  @Get('v1.2')
  async getListQuery(): Promise<User[]> {
    return this.usersService.findAllQuery();
  }

  @Post()
  async create(@Body() createUserDto: Partial<User>): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
