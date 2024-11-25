import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from '../../models/dto/post/create-post.dto';
import { UpdatePostDto } from '../../models/dto/post/update-post.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { Post } from '../../models/entities/post.entity';
import { IUser } from '../../models/interfaces/user.interface';
import { PostRepository } from './post.repository';
import { LikeRepository } from './like.repository';

@Injectable()
export class PostsService {
  constructor(
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

  public async getById(userData: IUser, postId: number): Promise<Post> {
    await this.checkIsPostExistOrThrow(postId);
    return await this.postRepository.getById(userData.id, postId);
  }

  public async getByIdQuery(userData: IUser, postId: number): Promise<Post> {
    await this.checkIsPostExistOrThrow(postId);
    return await this.postRepository.getByIdQuery(userData.id, postId);
  }

  public async update(
    userData: IUser,
    postId: number,
    dto: UpdatePostDto,
  ): Promise<Post> {
    return await this.postRepository.updatePost(userData.id, postId, dto);
  }

  public async remove(user: IUser, postId: number): Promise<void> {
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

    return await this.likeRepository.getPostLikes(postId);
  }

  public async unlike(userData: IUser, postId: number): Promise<number> {
    await this.checkIsPostExistOrThrow(postId);

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, author: { id: userData.id } },
    });
    if (!existingLike) {
      throw new ConflictException('Post not yet liked');
    }

    await this.likeRepository.remove(existingLike);

    return await this.likeRepository.getPostLikes(postId);
  }

  private async checkIsPostExistOrThrow(postId: number): Promise<void> {
    const postExists = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }
  }
}
