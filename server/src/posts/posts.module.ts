import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '../../models/entities/post.entity';
import { PostRepository } from './post.repository';
import { LikeRepository } from './like.repository';
import { PostgresModule } from '../postgres/postgres.module';
import { Comment } from '../../models/entities/comment.entity';
import { Like } from '../../models/entities/like.entity';

@Module({
  imports: [PostgresModule, TypeOrmModule.forFeature([Post, Comment, Like])],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, LikeRepository],
})
export class PostsModule {}
