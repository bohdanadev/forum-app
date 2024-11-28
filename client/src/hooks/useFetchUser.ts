import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.servise';
import { QUERY_KEYS } from '../constants/app-keys';

const useFetchUser = (id: string) => {
  useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => await userService.getById(id),
  });
};

export default useFetchUser;
