import { PickType } from '@nestjs/mapped-types';
import { SignUpReqDto } from './signUp.req.dto';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Notification } from '../entities/notification.entity';

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
  @IsArray()
  notifications: Notification[];
}
