import { Expose, Type } from 'class-transformer';

import { UserResDto } from '../user.res.dto';
import { Like } from '../../entities/like.entity';

export class CommentsResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  @Type(() => UserResDto)
  author: Partial<UserResDto>;

  @Expose()
  @Type(() => Like)
  likes: Like[];

  @Expose()
  @Type(() => CommentsResponseDto)
  replies: CommentsResponseDto[];
}
