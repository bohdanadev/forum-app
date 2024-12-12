import { FilterQuery, Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { ApiError } from '../api-error/api-error';
import { CreatePostDto } from '../../models/dto/post/create-post.dto';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { IPostDoc, PostModel } from '../../models/schemas/post.schema';
import { notificationService } from '../notifications/notifications.service';
import { IPostsListQuery } from '../interfaces/post/posts.query.interface';
import { IUserRes } from '../interfaces/auth/auth.res.interface';

class PostService {
  async getList(query: IPostsListQuery): Promise<[IPostDoc[], number]> {
    const filterObj: FilterQuery<IPostDoc> = {};

    if (query.authorId) {
      if (Types.ObjectId.isValid(query.authorId)) {
        filterObj.author = new Types.ObjectId(query.authorId);
      } else {
        throw new Error('Invalid authorId format');
      }
    }

    if (query.tag) {
      filterObj.tags = { $in: [query.tag] };
    }

    if (query.search) {
      filterObj.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ];
    }

    return await Promise.all([
      PostModel.find(filterObj)
        .populate('author')
        .sort({ createdAt: -1 })
        .limit(query.limit)
        .skip(query.offset),
      PostModel.countDocuments(filterObj),
    ]);
  }

  async getListQuery(query: PostsListQueryDto): Promise<[IPostDoc[], number]> {
    const filterObj: Record<string, any> = {};

    if (query.authorId) {
      if (Types.ObjectId.isValid(query.authorId)) {
        filterObj.author = new Types.ObjectId(query.authorId);
      } else {
        throw new Error('Invalid authorId format');
      }
    }

    if (query.tag) {
      filterObj.tags = { $in: [query.tag] };
    }

    if (query.search) {
      filterObj.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ];
    }

    const skip = +query.offset || 0;
    const limit = +query.limit || 3;

    const results = await PostModel.aggregate([
      { $match: filterObj },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          posts: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const posts = results[0]?.posts || [];
    const totalCount = results[0]?.totalCount[0]?.count || 0;

    return [posts, totalCount];
  }

  async getById(user: IUserRes, id: string): Promise<IPostDoc | null> {
    return PostModel.findById(id).populate('author');
  }

  async getByIdQuery(user: IUserRes, id: string): Promise<IPostDoc | null> {
    const objectId = new Types.ObjectId(id);
    const result = await PostModel.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          tags: 1,
          imageUrl: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: 1,
          comments: 1,
          author: {
            id: { $toString: '$author._id' },
            username: '$author.username',
            avatarUrl: '$author.avatarUrl',
          },
        },
      },
    ]);

    return result.length > 0 ? (result[0] as IPostDoc) : null;
  }

  async create(user: IUserRes, data: CreatePostDto): Promise<IPostDoc> {
    const newPost = new PostModel({ ...data, author: user.id });
    return newPost.save();
  }

  async update(id: string, data: Partial<IPostDoc>): Promise<IPostDoc | null> {
    return PostModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async like(userData: IUserRes, id: string): Promise<number> {
    const { id: userId, username } = userData;
    const post = await PostModel.findById(id);

    if (post.author.toString() === userId) {
      throw new ApiError('You cannot like your own post', HttpStatus.FORBIDDEN);
    }

    if (post.likes.includes(new Types.ObjectId(userId))) {
      throw new ApiError(
        'You have already liked this post',
        HttpStatus.BAD_REQUEST,
      );
    }

    post.likes.push(new Types.ObjectId(userId));
    await post.save();
    await notificationService.createNotification(
      post.author._id.toString(),
      userId,
      `${username} liked your post: "${post.title}"`,
      post.id,
    );
    return post.likes.length;
  }

  async delete(id: string): Promise<void> {
    return PostModel.findByIdAndDelete(id);
  }
}

export const postService = new PostService();
