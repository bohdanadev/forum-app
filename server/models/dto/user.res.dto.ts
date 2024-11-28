import { PickType } from '@nestjs/mapped-types';
import { SignUpReqDto } from './signUp.req.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UserResDto extends PickType(SignUpReqDto, [
  'username',
  'email',
  'avatarUrl',
]) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsDate()
  createdAt: Date;
}
