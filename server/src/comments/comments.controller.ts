import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../../models/entities/user.entity';
import { CommentResponseDto } from '../../models/dto/comment/comments.res.dto';

@Controller('api/posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: User,
    @Body('content') content: string,
    @Body('parentCommentId') parentCommentId?: number,
  ) {
    return this.commentService.createComment(
      postId,
      user,
      content,
      parentCommentId,
    );
  }

  @Get('v1.1')
  async getCommentsWithRepliesForPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getPostCommentsWithReplies(postId);
  }

  @Get('v1.2')
  async getCommentsWithRepliesForPostQuery(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getPostCommentsWithRepliesQuery(postId);
  }

  @Get()
  async getCommentsForPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.getCommentsForPost(postId);
  }

  @Get('replies/:commentId')
  async getRepliesForComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.getRepliesForComment(commentId);
  }

  @Post('like')
  public async likeComment(
    @CurrentUser() userData: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body('commentId') commentId: number,
  ): Promise<number> {
    const result = await this.commentService.like(userData, postId, commentId);
    return result;
  }
}
