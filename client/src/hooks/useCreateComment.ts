import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postService } from '../services/post.service';
import { QUERY_KEYS } from '../constants/app-keys';

interface CreateCommentInput {
  postId: number | string;
  content: string;
  parentCommentId?: number | string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCommentInput) =>
      await postService.createComment(
        input.postId,
        input.content,
        input.parentCommentId
      ),
    onSuccess: (_newComment, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, variables.postId],
      });
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
    },
  });
};
