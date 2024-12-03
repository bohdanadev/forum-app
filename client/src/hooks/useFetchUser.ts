import { useQuery } from '@tanstack/react-query';

import { userService } from '../services/user.servise';
import { QUERY_KEYS } from '../constants/app-keys';
import { IUser } from '../interfaces/user.interface';

const useFetchUser = (id: string) => {
  return useQuery<IUser>({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => await userService.getById(id),
  });
};
export default useFetchUser;
