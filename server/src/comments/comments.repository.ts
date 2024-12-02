import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

import { Comment } from '../../models/entities/comment.entity';
import { CommentResponseDto } from '../../models/dto/comment/comments.res.dto';
import { DATA_SOURCE } from '../../utils/constants';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    super(Comment, dataSource.manager);
  }

  async findAllCommentsWithReplies(
    postId: number,
  ): Promise<CommentResponseDto[]> {
    const rawComments = await this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.likes', 'commentLikes')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parentCommentId IS NULL')
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    const fetchReplies = async (parentComment: Comment): Promise<Comment[]> => {
      const replies = await this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'author')
        .leftJoinAndSelect('comment.likes', 'commentLikes')
        .where('comment.parentCommentId = :parentCommentId', {
          parentCommentId: parentComment.id,
        })
        .orderBy('comment.createdAt', 'ASC')
        .getMany();

      for (const reply of replies) {
        reply.replies = await fetchReplies(reply);
      }

      return replies;
    };

    for (const comment of rawComments) {
      comment.replies = await fetchReplies(comment);
    }

    const comments = plainToInstance(CommentResponseDto, rawComments, {
      excludeExtraneousValues: true,
    });

    return comments;
  }

  async findAllCommentsWithRepliesQuery(
    postId: number,
  ): Promise<CommentResponseDto[]> {
    const rawComments = await this.query(
      `
  WITH RECURSIVE comment_hierarchy AS (

  SELECT
    c.id,
    c.content,
    c."createdAt",
    c."updatedAt",
    c."parentCommentId",
    c."postId",
    c."authorId"
  FROM comment c
  WHERE c."postId" = $1 AND c."parentCommentId" IS NULL

  UNION ALL


  SELECT
    r.id,
    r.content,
    r."createdAt",
    r."updatedAt",
    r."parentCommentId",
    r."postId",
    r."authorId"
  FROM comment r
  INNER JOIN comment_hierarchy ch
  ON r."parentCommentId" = ch.id
)


SELECT
  ch.*,
  u.username AS "authorUsername",
  u."avatarUrl" AS "authorAvatarUrl",
  COALESCE(json_agg(json_build_object('id', l.id, 'authorId', l."authorId")) FILTER (WHERE l."commentId" IS NOT NULL), '[]') AS "likes"
FROM comment_hierarchy ch
LEFT JOIN users u
  ON u.id = ch."authorId"
LEFT JOIN "like" l  -- Enclosed in double quotes
  ON l."commentId" = ch.id
GROUP BY
  ch.id,
  ch.content,
  ch."createdAt",
  ch."updatedAt",
  ch."parentCommentId",
  ch."postId",
  ch."authorId",
  u.username,
  u."avatarUrl"
ORDER BY ch."createdAt" ASC;


      `,
      [postId],
    );

    const commentMap: Record<number, CommentResponseDto> = {};
    const topLevelComments: CommentResponseDto[] = [];

    rawComments.forEach((rawComment) => {
      const comment: CommentResponseDto = {
        id: rawComment.id,
        content: rawComment.content,
        createdAt: rawComment.createdAt,
        updatedAt: rawComment.updatedAt,
        parentCommentId: rawComment.parentCommentId || null,
        author: {
          id: rawComment.authorId,
          username: rawComment.authorUsername,
          avatarUrl: rawComment.authorAvatarUrl,
        },
        likes: rawComment.likes || [],
        replies: [],
      };

      commentMap[comment.id] = comment;

      if (comment.parentCommentId) {
        const parentComment = commentMap[comment.parentCommentId];
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        topLevelComments.push(comment);
      }
    });

    return topLevelComments;
  }

  async findCommentsByPost(postId: number): Promise<Comment[]> {
    return this.find({
      where: { post: { id: postId }, parentComment: null },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'ASC' },
    });
  }

  async findReplies(commentId: number): Promise<Comment[]> {
    return this.find({
      where: { parentComment: { id: commentId } },
      relations: ['author', 'replies'],
      order: { createdAt: 'ASC' },
    });
  }
}
