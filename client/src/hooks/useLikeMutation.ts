import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { QUERY_KEYS } from '../constants/app-keys';
import { postService } from '../services/post.service';

interface LikeInput {
  postId: string | number;
  commentId?: number | string;
}

const mutateLike = async (input: LikeInput): Promise<number> => {
  const { postId, commentId } = input;
  return commentId
    ? await postService.likeComment(postId, commentId)
    : await postService.likePost(postId);
};

export const useMutateLike = () => {
  const queryClient = useQueryClient();

  return useMutation<number, unknown, LikeInput>({
    mutationFn: mutateLike,

    onSuccess: (data, variables) => {
      if (variables.commentId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMMENTS, variables.postId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.POSTS, variables.postId.toString()],
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
};
