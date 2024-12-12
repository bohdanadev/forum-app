import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';

import { IPost } from '../../models/interfaces/post.interface';
import { postService } from './posts.service';
import { UserMapper } from '../../utils/user-mapper';
import { IPostsListRes } from '../interfaces/post/posts.res.interface';
import { IPostsListQuery } from '../interfaces/post/posts.query.interface';
import { IPostDoc } from '../../models/schemas/post.schema';

class PostController {
  async getList(req: Request, res: Response): Promise<Response<IPostsListRes>> {
    const query = req.query as IPostsListQuery;
    const [posts, total] = await postService.getList(query);
    const data = posts.map((post) => ({
      ...post.toJSON(),
      likes: post.likes.length,
      comments: post.comments.length,
      author: {
        id: post.author._id.toString(),
        username: post.author.username,
        avatarUrl: post.author.avatarUrl,
      },
    }));
    return res.status(HttpStatus.OK).json({ data, total, ...query });
  }

  async getListQuery(
    req: Request,
    res: Response,
  ): Promise<Response<IPostsListRes>> {
    const query = req.query as IPostsListQuery;
    const [posts, total] = await postService.getListQuery(query);
    const data = posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      author: post.author
        ? {
            id: post.author._id.toString(),
            username: post.author.username,
            avatarUrl: post.author.avatarUrl,
          }
        : null,
    }));
    return res.status(HttpStatus.OK).json({ data, total, ...query });
  }

  async getPostById(req: Request, res: Response): Promise<Response<IPostDoc>> {
    const { id } = req.params;
    const user = req.user;
    const post = (await postService.getById(user, id)).toJSON();

    if (!post) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Post not found' });
    }

    return res
      .status(HttpStatus.OK)
      .json({ ...post, author: UserMapper.toUserPublicData(post.author) });
  }

  async getPostByIdQuery(
    req: Request,
    res: Response,
  ): Promise<Response<IPost>> {
    const { id } = req.params;

    const post = await postService.getByIdQuery(req.user, id);

    if (!post) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Post not found' });
    }

    return res.status(HttpStatus.OK).json({
      ...post,
      id: post._id.toString(),
    });
  }

  async createPost(req: Request, res: Response): Promise<Response<IPostDoc>> {
    const newPost = await postService.create(req.user, req.body);

    return res.status(HttpStatus.CREATED).json(newPost);
  }

  async updatePost(req: Request, res: Response): Promise<Response<IPostDoc>> {
    const { id } = req.params;
    const updatedPost = await postService.update(id, req.body);

    return res.status(HttpStatus.OK).json(updatedPost);
  }

  async likePost(req: Request, res: Response): Promise<Response<number>> {
    const { id } = req.params;
    const likesCount = await postService.like(req.user, id);

    return res.status(HttpStatus.OK).json(likesCount);
  }

  async deletePost(req: Request, res: Response): Promise<Response<void>> {
    const { id } = req.params;

    await postService.delete(id);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Post deleted successfully' });
  }
}

export const postController = new PostController();
