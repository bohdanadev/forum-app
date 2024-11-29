import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.servise';
import { QUERY_KEYS } from '../constants/app-keys';
import { IUser } from '../interfaces/user.interface';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const useMutateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<IUser | void, void, { data?: Partial<IUser> }>({
    mutationFn: async ({ data }) =>
      data
        ? await userService.updateProfile(data)
        : await userService.deleteAccount(),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData([QUERY_KEYS.USER], data);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      } else {
        queryClient.setQueryData([QUERY_KEYS.USER], null);
        authService.signOut();
        navigate('signup');
      }
    },
  });
};

export default useMutateProfile;
