import { Type } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export class SignInReqDto {
  @IsString()
  @Type(() => String)
  identifier: string;

  @IsString()
  @Length(8, 30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;
}
