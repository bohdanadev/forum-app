import { UserResDto } from '../models/dto/user.res.dto';
import { IUser } from '../models/interfaces/user.interface';

export class UserMapper {
  public static toResponseDTO(data: IUser): UserResDto {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt,
      notifications: data.notifications,
    };
  }

  public static toUserPublicData(data: IUser): Partial<UserResDto> {
    return {
      id: data.id,
      username: data.username,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt,
    };
  }
}
