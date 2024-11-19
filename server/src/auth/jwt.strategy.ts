import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Injectable } from '@nestjs/common';
import { Config, JwtConfig } from '../../config/config.type';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/entities/user.entity';

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

  async validate(payload: any) {
    return await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
  }
}
