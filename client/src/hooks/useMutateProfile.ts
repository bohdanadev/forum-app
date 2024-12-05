import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { userService } from '../services/user.servise';
import { QUERY_KEYS, ROUTER_KEYS } from '../constants/app-keys';
import { IUser } from '../interfaces/user.interface';
import { authService } from '../services/auth.service';

const useMutateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<IUser | void, unknown, { data?: Partial<IUser> }>({
    mutationFn: async ({ data }) =>
      data && Object.keys(data).length > 0
        ? await userService.updateProfile(data)
        : await userService.deleteAccount(),
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData<IUser>([QUERY_KEYS.USER], (oldData) =>
          oldData
            ? {
                ...oldData,
                ...variables.data,
              }
            : oldData
        );
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
        localStorage.removeItem('user');
        localStorage.setItem(
          'user',
          JSON.stringify({ ...data, ...variables.data })
        );
        toast.success('Successfully updated profile.');
      } else {
        queryClient.setQueryData([QUERY_KEYS.USER], null);
        toast.success('Profile deleted.');
        authService.signOut();
        navigate(ROUTER_KEYS.SIGNUP);
      }
    },
    onError: (error) => {
      toast.error('Failed to update profile.');
    },
  });
};

export default useMutateProfile;
