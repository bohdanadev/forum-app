import { API_KEYS } from '../constants/app-keys';
import { IUser } from '../interfaces/user.interface';
import HttpService from './http.service';

class UserService extends HttpService {
  constructor() {
    super();
  }

  async getList() {
    return this.get<IUser[]>(`${API_KEYS.USERS}/${API_KEYS.VERSION}`, {}, true); //Paginated {..., IUser[]}
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
}
export const userService = new UserService();
