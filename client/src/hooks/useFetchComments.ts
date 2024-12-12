import { useQuery } from '@tanstack/react-query';

import { postService } from '../services/post.service';
import { IComment } from '../interfaces/comment.interface';
import { QUERY_KEYS } from '../constants/app-keys';

const fetchComments = async (postId: number | string): Promise<IComment[]> => {
  const response = await postService.getCommentsForPost(postId);
  return response;
};

export const useFetchComments = (postId: number | string) => {
  return useQuery<IComment[], Error>({
    queryKey: [QUERY_KEYS.COMMENTS, postId],
    queryFn: () => fetchComments(postId),

    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
