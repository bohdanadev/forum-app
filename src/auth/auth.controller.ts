import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { UsersService } from '../users/users.service';
import { SignUpReqDto } from '../../models/dto/user/signUp.req.dto';
import { CurrentUser } from './current-user.decorator';
import { IUser } from '../../models/interfaces/user.interface';

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
  async create(@Body() createUserDto: SignUpReqDto): Promise<void> {
    return this.userService.create(createUserDto);
  }

  @Post('logout')
  logout(
    @Request() req: any,
    @Response() res: any,
    @CurrentUser() user: IUser,
  ) {
    if (user) {
      res.status(HttpStatus.OK).send({ message: 'Logged out successfully' });
    }
  }
}
