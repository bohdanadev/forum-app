import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentRepository } from './comments.repository';
import { Post } from '../../models/entities/post.entity';
import { PostRepository } from '../posts/post.repository';
import { User } from '../../models/entities/user.entity';
import { Comment } from '../../models/entities/comment.entity';
import { LikeRepository } from '../likes/like.repository';
import { NotificationService } from '../notifications/notifications.service';

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
    author: User,
    content: string,
    parentCommentId?: number,
  ): Promise<Comment> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let parentComment: Comment | null = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOneBy({
        id: parentCommentId,
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const newComment = this.commentRepository.create({
      content,
      author,
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
    return newComment;
  }

  async getPostCommentsWithReplies(postId: number) {
    return this.commentRepository.findAllCommentsWithReplies(postId);
  }

  async getPostCommentsWithRepliesQuery(postId: number) {
    return this.commentRepository.findAllCommentsWithRepliesQuery(postId);
  }

  async getCommentsForPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.findCommentsByPost(postId);
  }

  async getRepliesForComment(commentId: number): Promise<Comment[]> {
    return this.commentRepository.findReplies(commentId);
  }

  public async like(
    userData: User,
    postId: number,
    commentId: number,
  ): Promise<number> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comment'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.comments['commentId'].author.id === userData.id) {
      throw new ConflictException('You cannot like your own comment');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { comment: { id: commentId }, author: { id: userData.id } },
    });
    if (existingLike) {
      throw new ConflictException('Comment already liked');
    }

    const newLike = this.likeRepository.create({
      comment: { id: commentId },
      author: { id: userData.id },
    });
    await this.likeRepository.save(newLike);

    if (post.comments['commentId'].author.id !== userData.id) {
      await this.notificationService.createNotification(
        post.comments['commentId'].author,
        userData,
        `${userData.username} liked your post: "${post.title}"`,
        post,
      );
    }

    return await this.likeRepository.getCommentLikes(commentId);
  }
}
