import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreatePostDto } from '../../models/dto/post/create-post.dto';
import { UpdatePostDto } from '../../models/dto/post/update-post.dto';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { Post } from '../../models/entities/post.entity';
import { IUser } from '../../models/interfaces/user.interface';
import { PostRepository } from './post.repository';
import { LikeRepository } from '../likes/like.repository';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly postRepository: PostRepository,
    private readonly likeRepository: LikeRepository,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async getList(
    userData: IUser | null,
    query: PostsListQueryDto,
  ): Promise<[Post[], number]> {
    return await this.postRepository.getList(
      userData ? userData.id : null,
      query,
    );
  }

  public async getListQuery(
    userData: IUser | null,
    query: PostsListQueryDto,
  ): Promise<[Post[], number]> {
    return await this.postRepository.getListQuery(
      userData ? userData.id : null,
      query,
    );
  }

  public async create(userData: IUser, dto: CreatePostDto): Promise<Post> {
    return await this.postRepository.createPost(userData, dto);
  }

  public async getById(postId: number): Promise<Post> {
    await this.checkIsPostExistOrThrow(postId);
    return await this.postRepository.getById(postId);
  }

  public async getByIdQuery(postId: number): Promise<Post> {
    await this.checkIsPostExistOrThrow(postId);
    return await this.postRepository.getByIdQuery(postId);
  }

  public async update(
    userData: IUser,
    postId: number,
    dto: UpdatePostDto,
  ): Promise<Post> {
    await this.checkIsPostExistOrThrow(postId);
    return await this.postRepository.updatePost(userData.id, postId, dto);
  }

  public async remove(user: IUser, postId: number): Promise<void> {
    await this.checkIsPostExistOrThrow(postId);
    return await this.postRepository.deletePost(user.id, postId);
  }

  public async like(userData: IUser, postId: number): Promise<number> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id === userData.id) {
      throw new ConflictException('You cannot like your own post');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, author: { id: userData.id } },
    });
    if (existingLike) {
      throw new ConflictException('Post already liked');
    }

    const newLike = this.likeRepository.create({
      post: { id: postId },
      author: { id: userData.id },
    });
    await this.likeRepository.save(newLike);

    if (post.author.id !== userData.id) {
      await this.notificationService.createNotification(
        post.author,
        userData,
        `${userData.username} liked your post: "${post.title}"`,
        post,
      );
    }

    return await this.likeRepository.getPostLikes(postId);
  }

  private async checkIsPostExistOrThrow(postId: number): Promise<Post> {
    return await this.postRepository.findOneOrFail({
      where: { id: postId },
    });
  }
}
