import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';

import { SignInReqDto } from '../../models/dto/signIn.req.dto';
import { AuthResDto } from '../../models/dto/auth.res.dto';
import { SignUpReqDto } from '../../models/dto/signUp.req.dto';
import { IJwtPayload } from '../../models/interfaces/token-payload.interface';
import { ApiError } from '../common/api-error';
import { generateAccessToken } from '../../utils/helpers';
import { UserMapper } from '../../utils/user-mapper';
import { UserModel } from '../../models/schemas/user.schema';
import { IUser } from '../../models/interfaces/user.interface';
import { userService } from '../users/users.service';

class AuthService {
  public async signUp(dto: SignUpReqDto): Promise<IUser> {
    // const existingUser = await userRepository.findByEmailNative(dto.email);
    const existingUser = await UserModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ApiError('User already exists', HttpStatus.CONFLICT);
    }
    const password = await bcrypt.hash(dto.password, 10);

    const user = await userService.create({ ...dto, password });

    return user;
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const result = await userService.getByParamsQuery(dto);
    if (!result) {
      throw new ApiError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // const isPasswordCorrect = await comparePassword(
    //   dto.password,
    //   result.password,
    // );
    // if (!isPasswordCorrect) {
    //   throw new ApiError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    // }
    const payload: IJwtPayload = {
      username: result.username,
      sub: result.id,
    };

    const access_token = await generateAccessToken(payload);
    const user = UserMapper.toResponseDTO(result);

    return { user, access_token };
  }
}

export const authService = new AuthService();
