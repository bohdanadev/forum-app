import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IsMatch } from '../../validation/is-match.constraint';

export class SignUpReqDto {
  @IsString()
  @Length(3, 20)
  @Type(() => String)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @Length(8, 30)
  @IsMatch('password')
  confirmPassword: string;
}
