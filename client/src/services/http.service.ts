import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class HttpService {
  private fetchingService: AxiosInstance;
  private baseUrl: string;
  // private apiVersion: string;

  constructor(
    baseUrl: string = import.meta.env.VITE_API_BASE_URL
    //  apiVersion: string = import.meta.env.VITE_API_VERSION || 'v1.1'
  ) {
    this.baseUrl = baseUrl;
    //  this.apiVersion = apiVersion;
    this.fetchingService = axios.create({
      //  baseURL: `${this.baseUrl}/${this.apiVersion}`,
      baseURL: this.baseUrl,
    });
  }

  // setApiVersion(version: string) {
  //   this.apiVersion = version;
  //   this.fetchingService.defaults.baseURL = `${this.baseUrl}/${version}`;
  // }

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
    withAuth = false
  ): Promise<T> {
    const headers = withAuth
      ? { ...config?.headers, ...this.getAuthHeaders() }
      : config?.headers;
    const response = await this.fetchingService.get<T>(url, {
      ...config,
      headers,
    });
    return response.data;
  }

  async post<T>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    config?: AxiosRequestConfig,
    withAuth = false
  ): Promise<T> {
    const headers = withAuth
      ? { ...config?.headers, ...this.getAuthHeaders() }
      : config?.headers;
    const response = await this.fetchingService.post<T>(url, data, {
      ...config,
      headers,
    });
    return response.data;
  }

  async put<T>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    config?: AxiosRequestConfig,
    withAuth = false
  ): Promise<T> {
    const headers = withAuth
      ? { ...config?.headers, ...this.getAuthHeaders() }
      : config?.headers;
    const response = await this.fetchingService.put<T>(url, data, {
      ...config,
      headers,
    });
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
    withAuth = false
  ): Promise<T> {
    const headers = withAuth
      ? { ...config?.headers, ...this.getAuthHeaders() }
      : config?.headers;
    const response = await this.fetchingService.delete<T>(url, {
      ...config,
      headers,
    });
    return response.data;
  }
}
