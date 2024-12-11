import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';

import { IJwtPayload } from '../interfaces/auth/jwt.payload.interface';
import { ApiError } from '../api-error/api-error';
import { generateAccessToken } from '../../utils/helpers';
import { UserModel } from '../../models/schemas/user.schema';
import { userService } from '../users/users.service';
import { ISignUp } from '../interfaces/auth/signup.interface';
import { ISignIn } from '../interfaces/auth/signin.interface';
import { IAuthResponse, IUserRes } from '../interfaces/auth/auth.res.interface';

class AuthService {
  public async signUp(dto: ISignUp): Promise<IUserRes> {
    const existingUser = await UserModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ApiError('User already exists', HttpStatus.CONFLICT);
    }
    const password = await bcrypt.hash(dto.password, 10);

    const user = await userService.create({ ...dto, password });

    return user;
  }

  public async signIn(dto: ISignIn): Promise<IAuthResponse> {
    const user = await userService.getByParamsQuery(dto);
    if (!user) {
      throw new ApiError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload: IJwtPayload = {
      username: user.username,
      sub: user.id,
    };
    const access_token = await generateAccessToken(payload);
    return { user, access_token };
  }
}

export const authService = new AuthService();
