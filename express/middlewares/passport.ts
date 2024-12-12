import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import * as passport from 'passport';

import { ConfigStaticService } from '../../config/config-static';
import { UserModel } from '../../models/schemas/user.schema';
import { IUserRes } from '../interfaces/auth/auth.res.interface';

export const config = ConfigStaticService.get();

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.accessSecret,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const result = await UserModel.findById(jwtPayload.sub);

      const user = result.toJSON() as IUserRes;

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
