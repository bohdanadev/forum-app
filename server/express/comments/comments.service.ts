import { HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { CommentModel, IComment } from '../../models/schemas/comment.schema';
import { ApiError } from '../common/api-error';
import { PostModel } from '../../models/schemas/post.schema';
import { transformObjectIdRecursive } from '../../utils/helpers';
import { notificationService } from '../notifications/notifications.service';
import { IUserRes } from '../interfaces/auth/auth.res.interface';

class CommentService {
  async createComment(
    user: IUserRes,
    content: string,
    postId: string,
    parentCommentId?: string,
  ): Promise<IComment> {
    const comment = new CommentModel({
      content,
      author: new Types.ObjectId(user.id),
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

      const parentComment = await CommentModel.findById(parentCommentId);

      if (parentComment && parentComment.author.toString() !== user.id) {
        await notificationService.createNotification(
          parentComment.author.toString(),
          user.id,
          `${user.username} replied to your comment`,
          postId,
          parentCommentId,
        );
      }
    } else {
      const post = await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
      });

      if (post && post.author.toString() !== user.id) {
        await notificationService.createNotification(
          post.author.toString(),
          user.id,
          `${user.username} commented on your post`,
          postId,
        );
      }
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

  async getCommentsByPostQuery(postId: string): Promise<any> {
    const comments = await CommentModel.aggregate([
      { $match: { post: postId, parentComment: null } },
      {
        $graphLookup: {
          from: 'comments',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentComment',
          as: 'nestedReplies',
          depthField: 'level',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
    ]);

    return comments.map(transformObjectIdRecursive);
  }

  async likeComment(commentId: string, user: IUserRes): Promise<number> {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      throw new ApiError('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.toString() === user.id) {
      throw new ApiError(
        'You cannot like your own comment',
        HttpStatus.CONFLICT,
      );
    }

    const hasLiked = comment.likes.includes(new Types.ObjectId(user.id));
    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== user.id);
    } else {
      comment.likes.push(new Types.ObjectId(user.id));
    }

    await comment.save();
    await notificationService.createNotification(
      comment.author.toString(),
      user.id,
      `${user.username} liked your comment: "${comment.content}"`,
      comment.post.toString(),
      comment.id,
    );
    return comment.likes.length;
  }
}
export const commentService = new CommentService();
