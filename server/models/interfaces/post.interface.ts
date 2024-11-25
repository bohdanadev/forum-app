import { Like } from '../../models/entities/like.entity';
import { UserResDto } from '../../models/dto/user.res.dto';
import { Comment } from '../../models/entities/comment.entity';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Partial<UserResDto>;
  likes: number | Like[];
  comments: number | Comment[];
  createdAt: Date;
  updatedAt: Date;
}
