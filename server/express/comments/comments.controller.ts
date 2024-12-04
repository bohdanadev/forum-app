import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { IComment } from '../../models/schemas/comment.schema';
import { commentService } from './comments.service';
import { UserMapper } from '../../utils/user-mapper';

class CommentController {
  async createComment(
    req: Request,
    res: Response,
  ): Promise<Response<IComment>> {
    const { id: postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    const comment = await commentService.createComment(
      userId,
      content,
      postId,
      parentCommentId,
    );

    return res.status(HttpStatus.CREATED).json({
      ...comment.toJSON(),
      author: UserMapper.toUserPublicData(comment.author),
    });
  }

  async getCommentsByPost(req: Request, res: Response): Promise<Response<any>> {
    const { id: postId } = req.params;

    const comments = await commentService.getCommentsByPost(postId);

    return res.status(HttpStatus.OK).json(comments);
  }

  async likeComment(req: Request, res: Response): Promise<Response<number>> {
    const { commentId } = req.body;
    const userId = req.user.id;

    const likesCount = await commentService.likeComment(commentId, userId);

    return res.status(HttpStatus.OK).json({ likes: likesCount });
  }
}

export const commentController = new CommentController();
