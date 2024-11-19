import { UserResDto } from '../models/dto/user.res.dto';
import { IUser } from '../models/interfaces/user.interface';

export class UserMapper {
  public static toResponseDTO(data: IUser): UserResDto {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      createdAt: data.createdAt,
    };
  }

  public static toUserPublicData(data: IUser): Partial<UserResDto> {
    return {
      username: data.username,
      createdAt: data.createdAt,
    };
  }
}
