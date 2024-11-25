import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DATA_SOURCE } from '../../utils/constants';
import { Post } from '../../models/entities/post.entity';
import { PostsListQueryDto } from '../../models/dto/post/posts-query.dto';
import { CreatePostDto } from '../../models/dto/post/create-post.dto';
import { IUser } from '../../models/interfaces/user.interface';
import { UpdatePostDto } from '../../models/dto/post/update-post.dto';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    super(Post, dataSource.manager);
  }

  public async getList(
    userId: string | null,
    query: PostsListQueryDto,
  ): Promise<[Post[], number]> {
    const qb = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes', 'likes.postId = post.id')
      .leftJoinAndSelect('post.comments', 'comments')
      .orderBy('post.createdAt', 'DESC');

    if (query.authorId) {
      qb.andWhere('post.author.id = :authorId', { authorId: query.authorId });
    }

    if (query.search) {
      qb.andWhere(`(post.title ILIKE :search OR post.content ILIKE :search)`, {
        search: `%${query.search}%`,
      });
    }

    if (query.tag) {
      qb.andWhere(':tag = ANY(post.tags)', { tag: query.tag });
    }

    qb.take(query.limit).skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getListQuery(
    userId: string | null,
    query: PostsListQueryDto,
  ): Promise<[Post[], number]> {
    let sql = `
    SELECT
      post.id,
      post."title",
      post."content",
      post."tags",
      post."imageUrl",
      post."createdAt",
      post."updatedAt",
      jsonb_build_object('id', author.id, 'username', author.username) AS author,
      COALESCE(
        jsonb_agg(DISTINCT jsonb_build_object('id', likes.id)) FILTER (WHERE likes.id IS NOT NULL),
        '[]'::jsonb
      ) AS likes,
      COALESCE(
        jsonb_agg(DISTINCT jsonb_build_object('id', comments.id, 'content', comments.content)) FILTER (WHERE comments.id IS NOT NULL),
        '[]'::jsonb
      ) AS comments
    FROM "post" AS post
    LEFT JOIN "users" AS author ON post."authorId" = author.id
    LEFT JOIN "like" AS likes ON likes."postId" = post.id
    LEFT JOIN "comment" AS comments ON comments."postId" = post.id
    WHERE 1=1
  `;

    const params: any[] = [];

    if (query.authorId) {
      sql += ` AND post."authorId" = $${params.length + 1}`;
      params.push(query.authorId);
    }

    if (query.search) {
      sql += ` AND (post."title" ILIKE $${params.length + 1} OR post."content" ILIKE $${params.length + 1})`;
      params.push(`%${query.search}%`);
    }

    if (query.tag) {
      sql += ` AND $${params.length + 1} = ANY(post."tags")`;
      params.push(query.tag);
    }

    sql += `
    GROUP BY
      post.id, post."title", post."content", post."tags", post."imageUrl", 
      post."createdAt", post."updatedAt", author.id, author.username
    ORDER BY post."createdAt" DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
    params.push(query.limit || 10, query.offset || 0);

    const posts = await this.dataSource.query(sql, params);

    let countSql = `
    SELECT COUNT(*) 
    FROM "post" AS post
    WHERE 1=1
  `;

    const countParams: any[] = [];

    if (query.authorId) {
      countSql += ` AND post."authorId" = $${countParams.length + 1}`;
      countParams.push(query.authorId);
    }

    if (query.search) {
      countSql += ` AND (post."title" ILIKE $${countParams.length + 1} OR post."content" ILIKE $${countParams.length + 1})`;
      countParams.push(`%${query.search}%`);
    }

    if (query.tag) {
      countSql += ` AND $${countParams.length + 1} = ANY(post."tags")`;
      countParams.push(query.tag);
    }

    const total = await this.dataSource.query(countSql, countParams);

    return [posts, parseInt(total[0].count, 10)];
  }

  public async createPost(
    userData: IUser,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const newPost = this.create({
      ...createPostDto,
      author: userData,
    });

    return await this.save(newPost);
  }

  public async getById(
    userId: string,
    postId: number,
    em?: EntityManager,
  ): Promise<Post> {
    const repo = em ? em.getRepository(Post) : this;
    const qb = repo.createQueryBuilder('post');

    qb.leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes', 'likes.postId = post.id')
      .leftJoin('likes.author', 'likeAuthor')
      .addSelect(['likeAuthor.id', 'likeAuthor.username'])
      .leftJoinAndSelect(
        'post.comments',
        'comments',
        'comments.postId = post.id',
      )
      .leftJoin('comments.author', 'commentAuthor')
      .addSelect(['commentAuthor.id', 'commentAuthor.username'])
      .where('post.id = :postId', { postId });

    return await qb.getOneOrFail();
  }

  public async getByIdQuery(
    userId: string,
    postId: number,
    em?: EntityManager,
  ): Promise<Post> {
    const queryRunner = em || this.dataSource.createQueryRunner();

    const sql = `
    SELECT
      post.*,
      jsonb_build_object('id', author.id, 'username', author.username) AS author,
      COALESCE(jsonb_agg(DISTINCT CASE 
      WHEN likes.id IS NOT NULL THEN 
      jsonb_build_object('id', likes.id, 'author', 
      jsonb_build_object('id', likeAuthor.id, 'username', likeAuthor.username))   
      END) FILTER (WHERE likes.id IS NOT NULL),
        '[]'::jsonb) AS likes,
      COALESCE(
        jsonb_agg(DISTINCT CASE 
          WHEN comments.id IS NOT NULL THEN 
            jsonb_build_object(
              'id', comments.id, 
              'content', comments.content, 
              'author', jsonb_build_object(
                'id', commentAuthor.id, 
                'username', commentAuthor.username
              )
            )
        END) FILTER (WHERE comments.id IS NOT NULL),
        '[]'::jsonb
      ) AS comments
    FROM post
    LEFT JOIN "users" AS author ON post."authorId" = author.id
    LEFT JOIN "like" AS likes ON likes."postId" = post.id
    LEFT JOIN "users" AS likeAuthor ON likes."authorId" = likeAuthor.id
    LEFT JOIN "comment" AS comments ON comments."postId" = post.id
    LEFT JOIN "users" AS commentAuthor ON comments."authorId" = commentAuthor.id
    WHERE post.id = $1
    GROUP BY post.id, author.id
  `;

    const params = [postId];

    const result = await queryRunner.query(sql, params);

    if (!result || result.length === 0) {
      throw new NotFoundException('Post not found');
    }

    return result[0];
  }

  public async updatePost(
    userId: string,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :postId', { postId })
      .andWhere('author.id = :userId', { userId })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.save({ ...post, ...updatePostDto });
  }

  public async deletePost(userId: string, postId: number): Promise<void> {
    const post = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :postId', { postId })
      .andWhere('author.id = :userId', { userId })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.remove(post);
  }
}
