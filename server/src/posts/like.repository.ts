import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Like } from '../../models/entities/like.entity';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.manager);
  }
  public async getPostLikes(postId: number): Promise<number> {
    const likesCount = await this.createQueryBuilder('like')
      .where('like.postId = :postId', { postId })
      .getCount();

    return likesCount;
  }
}
