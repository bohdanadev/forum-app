import { Types } from 'mongoose';
import { CommentModel, IComment } from '../../models/schemas/comment.schema';
import { ApiError } from 'common/api-error';
import { HttpStatus } from '@nestjs/common';

class CommentService {
  async createComment(
    userId: string,
    content: string,
    postId: string,
    parentCommentId?: string,
  ): Promise<IComment> {
    const comment = new CommentModel({
      content,
      author: userId,
      post: postId,
      parentComment: parentCommentId || null,
    });

    await comment.save();

    if (parentCommentId) {
      await CommentModel.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    return comment;
  }

  async getCommentsByPost(postId: string): Promise<IComment[]> {
    return CommentModel.find({ post: postId, parentComment: null })
      .populate('author', 'username')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username' },
      });
  }

  async likeComment(commentId: string, userId: string): Promise<number> {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      throw new ApiError('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.toString() === userId) {
      throw new ApiError(
        'You cannot like your own comment',
        HttpStatus.CONFLICT,
      );
    }

    const hasLiked = comment.likes.includes(new Types.ObjectId(userId));
    if (hasLiked) {
      // Unlike the comment
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the comment
      comment.likes.push(new Types.ObjectId(userId));
    }

    await comment.save();
    return comment.likes.length;
  }
}
export const commentService = new CommentService();
