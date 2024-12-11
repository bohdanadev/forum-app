import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { IComment } from '../../models/schemas/comment.schema';
import { commentService } from './comments.service';
import { IUserRes } from '../interfaces/auth/auth.res.interface';

class CommentController {
  async createComment(
    req: Request,
    res: Response,
  ): Promise<Response<IComment>> {
    const { id: postId } = req.params;
    const { content, parentCommentId } = req.body;
    const user = req.user as IUserRes;

    const comment = await commentService.createComment(
      user,
      content,
      postId,
      parentCommentId,
    );

    return res.status(HttpStatus.CREATED).json({
      ...comment.toJSON(),
      author: {
        id: comment.author.id,
        username: comment.author.username,
        avatarUrl: comment.author.avatarUrl,
      },
    });
  }

  async getCommentsByPost(req: Request, res: Response): Promise<Response<any>> {
    const { id: postId } = req.params;

    const comments = await commentService.getCommentsByPost(postId);

    return res.status(HttpStatus.OK).json(comments);
  }

  async getCommentsByPostQuery(
    req: Request,
    res: Response,
  ): Promise<Response<any>> {
    const { id: postId } = req.params;

    const comments = await commentService.getCommentsByPostQuery(postId);

    return res.status(HttpStatus.OK).json(comments);
  }

  async likeComment(req: Request, res: Response): Promise<Response<number>> {
    const { commentId } = req.body;
    const user = req.user as IUserRes;

    const likesCount = await commentService.likeComment(commentId, user);

    return res.status(HttpStatus.OK).json({ likes: likesCount });
  }
}

export const commentController = new CommentController();
