import { useInfiniteQuery } from '@tanstack/react-query';
import { INotification } from '../interfaces/notification.interface';
import { QUERY_KEYS } from '../constants/app-keys';
import { userService } from '../services/user.servise';

export interface NotificationsListQuery {
  limit?: number;
  offset?: number;
}

export interface NotificationsListRes {
  data: INotification[];
  total: number;
  limit: number;
  offset: number;
}

export const useFetchNotifications = (initialQuery: NotificationsListQuery) => {
  return useInfiniteQuery<NotificationsListRes, Error>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, initialQuery],
    queryFn: ({ pageParam = 0 }) =>
      userService.getNotifications({
        params: {
          limit: initialQuery.limit || 10,
          offset: pageParam as number,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentTotal = allPages.flatMap((page) => page.data).length;
      return currentTotal < lastPage.total ? currentTotal : undefined;
    },
    initialPageParam: 0,
  });
};
