import { API_KEYS } from '../constants/app-keys';
import {
  NotificationsListQuery,
  NotificationsListRes,
} from '../hooks/useFetchNotifications';
import { IUser } from '../interfaces/user.interface';
import HttpService from './http.service';

class UserService extends HttpService {
  constructor() {
    super();
  }

  async getList() {
    return this.get<IUser[]>(`${API_KEYS.USERS}/${API_KEYS.VERSION}`, {}, true);
  }

  async getById(id: string): Promise<IUser> {
    return this.get<IUser>(
      `${API_KEYS.USERS}/${API_KEYS.VERSION}/${id}`,
      {},
      true
    );
  }

  async updateProfile(data: Partial<IUser>): Promise<IUser> {
    const response = await this.put<IUser>(`${API_KEYS.USERS}`, data, {}, true);
    return response;
  }

  async deleteAccount() {
    await this.delete<void>(`${API_KEYS.USERS}`, {}, true);
  }

  async getNotifications({ params }: { params: NotificationsListQuery }) {
    return await this.get<NotificationsListRes>(
      `${API_KEYS.NOTIFICATIONS}/${API_KEYS.VERSION}?${new URLSearchParams(
        params as any
      )}`,
      {},
      true
    );
  }

  async readNotification(id: number | string) {
    return await this.patch<void>(
      `${API_KEYS.NOTIFICATIONS}/${id}/${API_KEYS.READ}`,
      {},
      {},
      true
    );
  }
}
export const userService = new UserService();
