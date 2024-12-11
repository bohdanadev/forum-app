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
import { CommentResponseDto } from '../../models/dto/comment/comments.res.dto';
import { IUser } from '../../models/interfaces/user.interface';

@Controller('api/posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: IUser,
    @Body('content') content: string,
    @Body('parentCommentId') parentCommentId?: number,
  ): Promise<CommentResponseDto> {
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

  @Post('like')
  public async likeComment(
    @CurrentUser() userData: IUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Body('commentId') commentId: number,
  ): Promise<number> {
    const result = await this.commentService.like(userData, postId, commentId);
    return result;
  }
}
