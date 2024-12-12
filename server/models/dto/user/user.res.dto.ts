import { PickType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { SignUpReqDto } from './signUp.req.dto';
import { Notification } from '../../entities/notification.entity';

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

  @IsOptional()
  notifications: number | Notification[];
}
