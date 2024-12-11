import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { IPost } from '../interfaces/post.interface';
import { postService } from '../services/post.service';
import { QUERY_KEYS, ROUTER_KEYS } from '../constants/app-keys';

const useMutatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    IPost | { message: string } | void,
    unknown,
    { id: number | string; data?: Partial<IPost> }
  >({
    mutationFn: async ({ id, data }) =>
      data
        ? await postService.updatePost(id, data)
        : await postService.deletePost(id),
    onSuccess: (data) => {
      if (data && 'id' in data) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.POSTS, data.id?.toString()],
        });

        queryClient.setQueryData<IPost[]>(
          [QUERY_KEYS.POSTS, data.id?.toString()],
          (oldData) =>
            oldData
              ? {
                  ...oldData,
                  data,
                }
              : oldData
        );
      } else {
        navigate(`/${ROUTER_KEYS.POSTS}`);
        toast.success('Post deleted!');
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      }
    },
    onError: () => {
      toast.error('An error occurred.');
    },
  });
};

export default useMutatePost;
