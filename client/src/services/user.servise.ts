import { API_KEYS } from '../constants/app-keys';
import { IUser } from '../interfaces/user.interface';
import HttpService from './http.service';

class UserService extends HttpService {
  constructor() {
    super();
  }

  async getList() {
    return this.get<IUser[]>(API_KEYS.USERS, {}, true); //Paginated {..., IUser[]}
  }

  async getById(id: string) {
    return this.get<IUser>(`${API_KEYS.USERS}/${id}`, {}, true);
  }

  async updateById(data: IUser) {
    const { id, ...user } = data;
    await this.put<void>(`${API_KEYS.USERS}/${id}`, user, {}, true);
  }

  async deleteAccount(id: string) {
    await this.delete<void>(`${API_KEYS.USERS}/${id}`, {}, true);
  }
}
export const userService = new UserService();
