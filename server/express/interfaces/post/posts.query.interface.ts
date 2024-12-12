export interface IPostsListQuery {
  limit?: number;

  offset?: number;

  tag?: string;

  authorId?: string;

  search?: string;
}
