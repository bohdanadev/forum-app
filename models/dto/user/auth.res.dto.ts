import { UserResDto } from './user.res.dto';

export class AuthResDto {
  access_token: string;
  user: UserResDto;
}
