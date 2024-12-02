import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IPost } from '../interfaces/post.interface';
import { postService } from '../services/post.service';
import { QUERY_KEYS } from '../constants/app-keys';

const useMutatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IPost | void,
    void,
    { id: number | string; data?: Partial<IPost> }
  >({
    mutationFn: async ({ id, data }) =>
      data
        ? await postService.updatePost(id, data)
        : await postService.deletePost(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData<IPost>([QUERY_KEYS.POST], data!);

        queryClient.setQueryData<IPost[]>(
          [QUERY_KEYS.POSTS, { id: data.id }],
          (oldData) =>
            oldData
              ? {
                  ...oldData,
                  ...data,
                }
              : oldData
        );
      } else {
        queryClient.setQueryData([QUERY_KEYS.POST], null);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      }
    },
  });
};

export default useMutatePost;
