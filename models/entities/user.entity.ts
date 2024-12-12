import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Notification } from './notification.entity';

@Entity('users')
@Index(['username', 'email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column('text')
  @Exclude()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose()
  avatarUrl: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  @Expose()
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  @Expose()
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.author, { cascade: true })
  @Expose()
  likes: Like[];

  @OneToMany(() => Notification, (notification) => notification.recipient, {
    cascade: true,
  })
  @Expose()
  notifications: Notification[];
}
