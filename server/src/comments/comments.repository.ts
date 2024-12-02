import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { Comment } from '../../models/entities/comment.entity';
import { CommentsResponseDto } from '../../models/dto/comment/comments.res.dto';
import { UserResDto } from '../../models/dto/user.res.dto';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  async findAllCommentsWithReplies(
    postId: number,
  ): Promise<CommentsResponseDto[]> {
    const rawComments = await this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('replies.author', 'replyAuthor')
      .leftJoinAndSelect('comment.likes', 'commentLikes')
      .leftJoinAndSelect('replies.likes', 'replyLikes')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parentCommentId IS NULL')
      .orderBy('comment.createdAt', 'ASC')
      .addOrderBy('replies.createdAt', 'ASC')
      .getMany();

    const comments = plainToInstance(CommentsResponseDto, rawComments, {
      excludeExtraneousValues: true,
    });

    return comments;
  }

  async findAllCommentsWithRepliesQuery(
    postId: number,
  ): Promise<CommentsResponseDto[]> {
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
          c."authorId",
          NULL AS replyAuthorId
        FROM comments c
        WHERE c."postId" = $1 AND c."parentCommentId" IS NULL
  
        UNION ALL
  
        SELECT
          r.id,
          r.content,
          r."createdAt",
          r."updatedAt",
          r."parentCommentId",
          r."postId",
          r."authorId",
          r."authorId" AS replyAuthorId
        FROM comments r
        INNER JOIN comment_hierarchy ch
        ON r."parentCommentId" = ch.id
      )
      SELECT
        ch.*,
        u.username AS "authorUsername",
        u."avatarUrl" AS "authorAvatarUrl",
        ru.username AS "replyAuthorUsername",
        ru."avatarUrl" AS "replyAuthorAvatarUrl",
        COALESCE(like_agg.likes, '[]') AS "likes"
      FROM comment_hierarchy ch
      LEFT JOIN users u
        ON u.id = ch."authorId"
      LEFT JOIN users ru
        ON ru.id = ch.replyAuthorId
      LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object('id', l.id, 'authorId', l."authorId")) AS likes
        FROM likes l
        WHERE l."commentId" = ch.id
      ) like_agg ON true
      ORDER BY ch."createdAt" ASC;
      `,
      [postId],
    );

    const commentMap: { [key: number]: Comment } = {};
    const topLevelComments: CommentsResponseDto[] = [];

    rawComments.forEach((rawComment) => {
      const comment: Comment = {
        id: rawComment.id,
        content: rawComment.content,
        createdAt: rawComment.createdAt,
        updatedAt: rawComment.updatedAt,
        parentComment: rawComment.parentCommentId
          ? ({ id: rawComment.parentCommentId } as Comment)
          : null,
        post: { id: rawComment.postId } as any,
        author: {
          id: rawComment.authorId,
          username: rawComment.authorUsername,
          avatarUrl: rawComment.authorAvatarUrl,
        } as Partial<UserResDto>,
        replies: [],
        likes: rawComment.likes || [],
      };

      commentMap[comment.id] = comment;

      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment.id];
        if (parent) {
          parent.replies.push(comment);
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
