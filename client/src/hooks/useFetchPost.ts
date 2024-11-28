import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../constants/app-keys';
import { postService } from '../services/post.service';

export const useFetchPost = (slug: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.POSTS, slug],
    queryFn: async () => await postService.fetchPostById(slug),
  });
