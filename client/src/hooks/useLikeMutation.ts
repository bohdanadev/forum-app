import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      //   queryClient.setQueryData<number>(
      //     [
      //       QUERY_KEYS.LIKES,
      //       variables.commentId ? variables.commentId : variables.postId,
      //     ],
      //     data
      //   );

      if (!variables.commentId && variables.postId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.POST, variables.postId],
        });
      }

      if (variables.commentId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.COMMENTS, variables.postId],
        });
      }
    },
  });
};
