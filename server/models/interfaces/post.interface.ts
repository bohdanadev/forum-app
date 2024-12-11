import { Like } from '../../models/entities/like.entity';
import { UserResDto } from '../dto/user/user.res.dto';
import { Comment } from '../../models/entities/comment.entity';

export interface IPost {
  id?: number | string;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Partial<UserResDto>;
  likes: number | Like[];
  comments: number | Comment[];
  createdAt: Date;
  updatedAt?: Date;
}
