import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userService } from '../services/user.servise';
import { QUERY_KEYS } from '../constants/app-keys';
import { IUser } from '../interfaces/user.interface';
import { INotification } from '../interfaces/notification.interface';

const readNotification = async (id: number | string): Promise<void> => {
  return await userService.readNotification(id);
};

export const useMutateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number | string>({
    mutationFn: readNotification,

    onSuccess: (data, notificationId) => {
      queryClient.setQueryData([QUERY_KEYS.USER], (cachedUser: IUser) => {
        if (!cachedUser) return cachedUser;

        const updatedNotifications = cachedUser?.notifications?.map(
          (notification: INotification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
        );

        return {
          ...cachedUser,
          notifications: updatedNotifications,
        };
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },

    onError: (error) => {
      console.error('Error marking notification as read:', error);
    },
  });
};
