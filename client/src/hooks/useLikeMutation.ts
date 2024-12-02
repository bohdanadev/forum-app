import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../constants/app-keys';
import { postService } from '../services/post.service';

interface LikeInput {
  postId: string | number;
  commentId?: number | string;
}

const mutateLike = async (input: LikeInput): Promise<number> => {
  const { postId, commentId } = input;
  return !commentId
    ? await postService.likePost(postId)
    : await postService.likeComment(postId, commentId);
};

export const useMutateLike = () => {
  const queryClient = useQueryClient();

  return useMutation<number, unknown, LikeInput>({
    mutationFn: mutateLike,
    onMutate: async (variables) => {
      const { postId, commentId } = variables;

      if (commentId) {
        await queryClient.cancelQueries({
          queryKey: [QUERY_KEYS.LIKES, commentId],
        });
      } else {
        await queryClient.cancelQueries({
          queryKey: [QUERY_KEYS.LIKES, postId],
        });
      }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<number>(
        [
          QUERY_KEYS.LIKES,
          variables.commentId ? variables.commentId : variables.postId,
        ],
        data
      );
    },
  });
};
