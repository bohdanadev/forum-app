import { Expose, Transform, Type } from 'class-transformer';

import { Like } from '../../entities/like.entity';

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ value }) => ({
    id: value.id,
    username: value.username,
    avatarUrl: value.avatarUrl,
  }))
  author: { id: string; username: string; avatarUrl: string };

  @Expose()
  @Type(() => Like)
  likes?: Like[];

  @Expose()
  parentCommentId?: number;

  @Expose()
  @Type(() => CommentResponseDto)
  replies?: CommentResponseDto[];
}
