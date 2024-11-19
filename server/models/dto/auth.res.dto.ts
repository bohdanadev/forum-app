import { UserResDto } from './user.res.dto';

export class AuthResDto {
  token: string;
  user: UserResDto;
}
