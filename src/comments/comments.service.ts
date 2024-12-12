import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { CommentRepository } from './comments.repository';
import { Post } from '../../models/entities/post.entity';
import { PostRepository } from '../posts/post.repository';
import { Comment } from '../../models/entities/comment.entity';
import { LikeRepository } from '../likes/like.repository';
import { NotificationService } from '../notifications/notifications.service';
import { CommentResponseDto } from '../../models/dto/comment/comments.res.dto';
import { IUser } from '../../models/interfaces/user.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
    private readonly likeRepository: LikeRepository,
    private readonly notificationService: NotificationService,
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
  ) {}

  async createComment(
    postId: number,
    author: IUser,
    content: string,
    parentCommentId?: number,
  ): Promise<CommentResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let parentComment: Comment | null = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: parentCommentId },
        relations: ['author'],
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const newComment = this.commentRepository.create({
      content,
      author: {
        id: author.id,
        username: author.username,
        avatarUrl: author.avatarUrl,
      },
      post,
      parentComment,
    });

    await this.commentRepository.save(newComment);

    if (post.author.id !== author.id) {
      await this.notificationService.createNotification(
        post.author,
        author,
        `${author.username} commented on your post: "${content}"`,
        post,
      );
    }

    if (parentComment && parentComment.author.id !== author.id) {
      await this.notificationService.createNotification(
        parentComment.author,
        author,
        `${author.username} replied to your comment: "${content}"`,
        post,
        parentComment,
      );
    }
    return plainToInstance(CommentResponseDto, newComment, {
      excludeExtraneousValues: true,
    });
  }

  async getPostCommentsWithReplies(
    postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentRepository.findAllCommentsWithReplies(postId);
  }

  async getPostCommentsWithRepliesQuery(
    postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentRepository.findAllCommentsWithRepliesQuery(postId);
  }

  public async like(
    userData: IUser,
    postId: number,
    commentId: number,
  ): Promise<number> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId, post: { id: postId } },
      relations: ['author'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id === userData.id) {
      throw new ConflictException('You cannot like your own comment');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { comment: { id: commentId }, author: { id: userData.id } },
    });
    if (existingLike) {
      throw new ConflictException('Comment already liked');
    }

    const newLike = this.likeRepository.create({
      comment,
      author: {
        id: userData.id,
        username: userData.username,
        avatarUrl: userData.avatarUrl,
      },
      post: null,
    });
    await this.likeRepository.save(newLike);

    if (comment.author.id !== userData.id) {
      await this.notificationService.createNotification(
        comment.author,
        userData,
        `${userData.username} liked your comment: "${comment.content}"`,
        post,
      );
    }

    return await this.likeRepository.getCommentLikes(commentId);
  }
}
