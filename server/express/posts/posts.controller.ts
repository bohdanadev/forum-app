import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { IPost } from '../../models/interfaces/post.interface';
import { postService } from './posts.service';
import { PostsListResDto } from '../../models/dto/post/posts.res.dto';
import { PostModel } from '../../models/schemas/post.schema';
import { ApiError } from 'common/api-error';

class PostController {
  async getList(req: Request, res: Response): Promise<Response<IPost[]>> {
    const query = req.query as PostsListQueryDto;
    const [posts, total] = await postService.getList(query);
    return res.status(HttpStatus.OK).json({ posts, total, ...query });
  }

  async getListQuery(
    req: Request,
    res: Response,
  ): Promise<Response<PostsListResDto>> {
    const query = req.query as PostsListQueryDto;
    const [posts, total] = await postService.getListQuery(query);
    return res.status(HttpStatus.OK).json({ posts, total, ...query });
  }

  async getPostById(req: Request, res: Response): Promise<Response<IPost>> {
    const { id } = req.params;
    const user = req.user;
    console.log(user);
    const post = await postService.getById(user, id);

    if (!post) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Post not found' });
    }

    return res.status(HttpStatus.OK).json(post);
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

    return res.status(HttpStatus.OK).json(post);
  }

  async createPost(req: Request, res: Response): Promise<Response<IPost>> {
    const newPost = await postService.create(req.user, req.body);

    return res.status(HttpStatus.CREATED).json(newPost);
  }

  async updatePost(req: Request, res: Response): Promise<Response<IPost>> {
    const { id } = req.params;
    const updatedPost = await postService.update(id, req.body);

    return res.status(HttpStatus.OK).json(updatedPost);
  }

  async likePost(
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; likes: number }>> {
    const { id } = req.params;
    const userId = req.user.id;
    const post = await postService.like(userId, id);
    if (!post) {
      throw new ApiError('Post not found', HttpStatus.NOT_FOUND);
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Post liked successfully', likes: post.likes.length });
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
