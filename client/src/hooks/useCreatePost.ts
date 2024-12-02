import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IPost } from '../interfaces/post.interface';
import { postService } from '../services/post.service';
import { QUERY_KEYS } from '../constants/app-keys';

const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<IPost, unknown, Partial<IPost>>({
    mutationFn: async (post) => await postService.createPost(post),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] }),
  });
};

export default useCreatePost;
