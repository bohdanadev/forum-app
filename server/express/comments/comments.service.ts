import { HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { CommentModel, IComment } from '../../models/schemas/comment.schema';
import { ApiError } from '../common/api-error';
import { PostModel } from '../../models/schemas/post.schema';
import { transformObjectIdRecursive } from '../../utils/helpers';

class CommentService {
  async createComment(
    userId: string,
    content: string,
    postId: string,
    parentCommentId?: string,
  ): Promise<IComment> {
    const comment = new CommentModel({
      content,
      author: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
      parentComment: parentCommentId
        ? new Types.ObjectId(parentCommentId)
        : null,
    });

    await comment.save();

    if (parentCommentId) {
      await CommentModel.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }
    if (!parentCommentId) {
      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
      });
    }

    return await CommentModel.findById(comment._id).populate('author');
  }

  async populateReplies(comment) {
    if (!comment.replies || comment.replies.length === 0) return comment;

    comment.replies = await CommentModel.find({ _id: { $in: comment.replies } })
      .populate('author', ['username', 'avatarUrl'])
      .lean();

    for (let i = 0; i < comment.replies.length; i++) {
      comment.replies[i] = await this.populateReplies(comment.replies[i]);
    }

    return comment;
  }

  async getCommentsByPost(postId: string): Promise<any> {
    const comments = await CommentModel.find({
      post: postId,
      parentComment: null,
    })
      .populate('author', ['username', 'avatarUrl'])
      .lean();

    for (let i = 0; i < comments.length; i++) {
      comments[i] = await this.populateReplies(comments[i]);
    }

    return comments.map(transformObjectIdRecursive);
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
