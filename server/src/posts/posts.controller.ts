import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from '../../models/dto/post/create-post.dto';
import { UpdatePostDto } from '../../models/dto/post/update-post.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { IUser } from '../../models/interfaces/user.interface';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { PostsListResDto } from '../../models/dto/post/posts.res.dto';
import { UserMapper } from '../../utils/user-mapper';
import { IPost } from '../../models/interfaces/post.interface';
import { User } from '../../models/entities/user.entity';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  public async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: IUser,
  ): Promise<IPost> {
    const { author, ...post } = await this.postsService.create(
      user,
      createPostDto,
    );
    return {
      ...post,
      author: UserMapper.toUserPublicData(author),
      comments: post.comments?.length ?? 0,
      likes: post.likes?.length ?? 0,
    };
  }

  @Public()
  @Get('v1.1')
  public async getList(
    @Query() query: PostsListQueryDto,
    @CurrentUser() userData?: IUser | null,
  ): Promise<PostsListResDto> {
    const [posts, total] = await this.postsService.getList(userData, query);

    const data = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      comments: post.comments.length,
      author: UserMapper.toUserPublicData(post.author),
    }));
    return { data, total, ...query };
  }

  @Public()
  @Get('v1.2')
  public async getListQuery(
    @Query() query: PostsListQueryDto,
    @CurrentUser() userData?: IUser | null,
  ): Promise<PostsListResDto> {
    const [posts, total] = await this.postsService.getListQuery(
      userData,
      query,
    );

    const data = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      comments: post.comments.length,
    }));
    return { data, total, ...query };
  }

  @Get(':postId/v1.1')
  public async findOne(
    @CurrentUser() userData: IUser,
    @Param('postId') postId: string,
  ): Promise<IPost> {
    const { author, ...post } = await this.postsService.getById(
      userData,
      +postId,
    );
    return { ...post, author: UserMapper.toUserPublicData(author) };
  }

  @Get(':postId/v1.2')
  public async findOneQuery(
    @CurrentUser() userData: IUser,
    @Param('postId') postId: string,
  ): Promise<IPost> {
    return await this.postsService.getByIdQuery(userData, +postId);
  }

  @Put(':postId')
  public async update(
    @CurrentUser() userData: IUser,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return await this.postsService.update(userData, +postId, dto);
  }

  @Delete(':postId')
  public async remove(
    @CurrentUser() user: IUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    return await this.postsService.remove(user, +postId);
  }

  @Post(':postId/like')
  public async likePost(
    @CurrentUser() userData: User,
    @Param('postId') postId: string,
  ): Promise<number> {
    const result = await this.postsService.like(userData, +postId);
    return result;
  }

  @Delete(':postId/like')
  public async unlike(
    @CurrentUser() userData: IUser,
    @Param('postId') postId: string,
  ): Promise<number> {
    return await this.postsService.unlike(userData, +postId);
  }
}
