import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Config, JwtConfig } from '../../config/config.type';
import { User } from '../../models/entities/user.entity';
import { IJwtPayload } from '../../models/interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly jwtConfig: JwtConfig;
  constructor(
    private readonly configService: ConfigService<Config>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfig>('jwt').accessSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    return await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
  }
}
