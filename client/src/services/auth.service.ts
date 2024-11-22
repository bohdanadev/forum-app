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
    this.storeToken(response.access_token);
    return response.user;
  }

  signOut() {
    localStorage.removeItem('accessToken');
  }

  private storeToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
