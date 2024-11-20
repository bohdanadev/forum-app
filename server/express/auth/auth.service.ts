import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { SignInReqDto } from '../../models/dto/signIn.req.dto';
import { AuthResDto } from '../../models/dto/auth.res.dto';
import { SignUpReqDto } from '../../models/dto/signUp.req.dto';
import { UserResDto } from '../../models/dto/user.res.dto';
import { IJwtPayload } from '../../models/interfaces/token-payload.interface';
import { userRepository } from '../users/users.repository';
import { ApiError } from '../common/api-error';
import { comparePassword, generateAccessToken } from '../../utils/helpers';
import { UserMapper } from '../../utils/user-mapper';

class AuthService {
  public async signUp(dto: SignUpReqDto): Promise<UserResDto> {
    const existingUser = await userRepository.findByEmailNative(dto.email);
    if (existingUser) {
      throw new ApiError('User already exists', HttpStatus.CONFLICT);
    }
    const password = await bcrypt.hash(dto.password, 10);
    const user = await userRepository.create({ ...dto, password });

    return user;
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const result = await userRepository.getByParamsQuery(dto.identifier);
    if (!result) {
      throw new ApiError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordCorrect = await comparePassword(
      dto.password,
      result.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload: IJwtPayload = {
      username: result.username,
      sub: result.id,
    };

    const token = await generateAccessToken(payload);
    const user = UserMapper.toResponseDTO(result);

    return { user, token };
  }
}

export const authService = new AuthService();
