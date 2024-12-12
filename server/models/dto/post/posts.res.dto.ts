import { IPost } from '../../interfaces/post.interface';
import { PostsListQueryDto } from './posts-query.dto';

export class PostsListResDto extends PostsListQueryDto {
  data: IPost[];
  total: number;
}
