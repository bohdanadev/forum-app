import { PickType } from '@nestjs/mapped-types';

import { SignUpReqDto } from './signUp.req.dto';

export class UserUpdateReqDto extends PickType(SignUpReqDto, [
  'username',
  'email',
  'avatarUrl',
]) {}
