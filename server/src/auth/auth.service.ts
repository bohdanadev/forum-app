import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';
import { Config, JwtConfig } from '../../config/config.type';
import { SignInReqDto } from '../../models/dto/signIn.req.dto';
import { UsersService } from '../users/users.service';
import { UserResDto } from '../../models/dto/user.res.dto';
import { IUser } from '../../models/interfaces/user.interface';

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
      return user;
    }

    return null;
  }

  async login(user: IUser) {
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
