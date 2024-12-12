import { API_KEYS } from '../constants/app-keys';
import { IAuthResponse } from '../interfaces/auth-response';
import { ISignIn, ISignUp } from '../interfaces/auth.interface';
import { IUser } from '../interfaces/user.interface';
import HttpService from './http.service';

class AuthService extends HttpService {
  constructor() {
    super();
  }

  async signUp(data: ISignUp) {
    const response = await this.post<IUser>(API_KEYS.SIGN_UP, data);
    return response;
  }

  async signIn(credentials: ISignIn) {
    const response = await this.post<IAuthResponse>(
      API_KEYS.SIGN_IN,
      credentials
    );
    this.storeToken(response.access_token, response.user);
  }

  signOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  private storeToken(token: string, user: IUser) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated() {
    if (localStorage.getItem('accessToken')) {
      return JSON.parse(localStorage.getItem('user')!);
    }
  }
}

export const authService = new AuthService();
