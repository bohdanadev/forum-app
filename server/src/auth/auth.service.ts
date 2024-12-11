import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Config, JwtConfig } from '../../config/config.type';
import { SignInReqDto } from '../../models/dto/user/signIn.req.dto';
import { UsersService } from '../users/users.service';
import { UserResDto } from '../../models/dto/user/user.res.dto';
import { AuthResDto } from '../../models/dto/user/auth.res.dto';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
  }
  public async validateUser(dto: SignInReqDto): Promise<UserResDto> {
    const user = await this.userService.findOne(dto);
    if (user) {
      console.log('Validated:', user);
      return user;
    }

    return null;
  }

  async login(user: UserResDto): Promise<AuthResDto> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfig.accessSecret,
        expiresIn: this.jwtConfig.accessExpiresIn,
      }),
      user,
    };
  }
}
