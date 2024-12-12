import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { PostgresModule } from '../postgres/postgres.module';
import { Comment } from '../../models/entities/comment.entity';
import { Like } from '../../models/entities/like.entity';
import { CommentRepository } from './comments.repository';
import { LikeRepository } from '../likes/like.repository';
import { NotificationService } from '../notifications/notifications.service';
import { PostRepository } from '../posts/post.repository';
import { PostsModule } from '../posts/posts.module';
import { Post } from '../../models/entities/post.entity';
import { Notification } from '../../models/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationRepository } from '../notifications/notifications.repository';

@Module({
  imports: [
    PostgresModule,
    PostsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([Comment, Like, Post, Notification]),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    NotificationService,
    PostRepository,
    CommentRepository,
    LikeRepository,
    NotificationRepository,
  ],
})
export class CommentsModule {}
