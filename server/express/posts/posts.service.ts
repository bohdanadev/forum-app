import { ApiError } from 'common/api-error';
import { CreatePostDto } from '../../models/dto/post/create-post.dto';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { IPostDoc, PostModel } from '../../models/schemas/post.schema';
import { FilterQuery, Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

class PostService {
  async getList(query: PostsListQueryDto): Promise<[IPostDoc[], number]> {
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

    const skip = query.offset || 0;
    const limit = query.limit || 3;

    const results = await PostModel.aggregate([
      { $match: filterObj },
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

  async getById(user: any, id: string): Promise<IPostDoc | null> {
    return PostModel.findById(id);
  }

  async getByIdQuery(user: any, id: string): Promise<IPostDoc | null> {
    const objectId = new Types.ObjectId(id);
    const result = await PostModel.aggregate([{ $match: { _id: objectId } }]);

    return result.length > 0 ? (result[0] as IPostDoc) : null;
  }

  async create(user: any, data: CreatePostDto): Promise<IPostDoc> {
    const newPost = new PostModel({ ...data, author: user });
    return newPost.save();
  }

  async update(id: string, data: Partial<IPostDoc>): Promise<IPostDoc | null> {
    return PostModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async like(userId: string, id: string): Promise<IPostDoc> {
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
    return post;
  }

  async delete(id: string): Promise<IPostDoc | null> {
    return PostModel.findByIdAndDelete(id);
  }
}

export const postService = new PostService();
