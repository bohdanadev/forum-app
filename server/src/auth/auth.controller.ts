import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { IUser } from '../../models/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { SignUpReqDto } from '../../models/dto/signUp.req.dto';
import { UserResDto } from '../../models/dto/user.res.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @Public()
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @Public()
  async create(@Body() createUserDto: SignUpReqDto): Promise<UserResDto> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req, @Response() res) {
    // req.logOut();
    res.status(HttpStatus.OK).send({ message: 'Logged out successfully' });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user: IUser) {
    return user;
  }
}
