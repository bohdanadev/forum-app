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
    onSuccess: (newComment, variables) => {
      queryClient.invalidateQueries(
        { queryKey: [QUERY_KEYS.COMMENTS] },
        variables.postId
      );

      //   const { postId, parentCommentId } = variables;

      //   queryClient.setQueryData<IComment[]>(
      //     [QUERY_KEYS.COMMENTS, postId],
      //     (oldComments = []) => {
      //       if (!newComment) return oldComments;

      //       if (parentCommentId) {
      //         return oldComments.map((comment) => {
      //           if (comment.id === parentCommentId) {
      //             return {
      //               ...comment,
      //               replies: [...(comment.replies || []), newComment],
      //             };
      //           }
      //           return comment;
      //         });
      //       }

      //       return [...oldComments, newComment];
      //     }
      //   );
    },
    onError: (error, variables, context) => {
      console.error('Error creating comment:', error);
    },
    // onSettled: (data, error, variables) => {
    //   queryClient.invalidateQueries(
    //     { queryKey: [QUERY_KEYS.COMMENTS] },
    //     variables.postId
    //   );
    // },
  });
};
