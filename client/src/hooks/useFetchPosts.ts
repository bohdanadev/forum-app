import { useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import { QUERY_KEYS } from '../constants/app-keys';
import { IPost } from '../interfaces/post.interface';

export interface PostsListQuery {
  limit?: number;
  offset?: number;
  tag?: string;
  authorId?: string;
  search?: string;
}

export interface PostsListRes {
  data: IPost[];
  total: number;
  limit: number;
  offset: number;
  tag?: string;
  authorId?: string;
  search?: string;
}

export const useFetchPosts = (initialQuery: PostsListQuery) => {
  return useInfiniteQuery<PostsListRes, Error>({
    queryKey: [QUERY_KEYS.POSTS, initialQuery],
    queryFn: ({ pageParam = 0 }) =>
      postService.fetchPosts({
        params: {
          limit: initialQuery.limit || 3,
          offset: pageParam as number,
          search: initialQuery.search,
          tag: initialQuery.tag,
          authorId: initialQuery.authorId,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentTotal = allPages.flatMap((page) => page.data).length;
      return currentTotal < lastPage.total ? currentTotal : undefined;
    },
    initialPageParam: 0,
  });
};
