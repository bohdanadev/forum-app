import { Exclude, Expose } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  @Expose()
  createdAt: Date;
}
