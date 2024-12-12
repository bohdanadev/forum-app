import { IUserRes } from '../express/interfaces/auth/auth.res.interface';
import { IUser } from '../express/interfaces/user/user.interface';
import { UserResDto } from '../models/dto/user/user.res.dto';

export type UserPublicData = Omit<UserResDto, 'email' | 'notifications'>;

export class UserMapper {
  public static toResponseDTO(data: IUser): IUserRes {
    return {
      ...data,
      id: data._id.toString(),
      _id: undefined,
      password: undefined,
    } as IUserRes;
  }

  public static toUserPublicData(data: UserResDto | IUserRes): UserPublicData {
    return {
      id: data.id,
      username: data.username,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt,
    };
  }
}
