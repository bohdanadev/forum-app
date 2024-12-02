import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { UserResDto } from '../dto/user.res.dto';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ type: 'text' })
  @Expose()
  message: string;

  @Column({ default: false })
  @Expose()
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actorId' })
  actor: Partial<UserResDto>;

  @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment?: Comment;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;
}
