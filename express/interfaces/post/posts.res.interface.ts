import { IPostDoc } from '../../../models/schemas/post.schema';
import { IPostsListQuery } from './posts.query.interface';

export interface IPostsListRes extends IPostsListQuery {
  data: IPostDoc[];
  total: number;
}
