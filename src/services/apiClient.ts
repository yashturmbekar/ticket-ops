/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { API_TIMEOUT, AUTH_TOKEN_KEY, UNAUTH_ROUTES } from "../constants";

// Token helpers
export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

const controllers: AbortController[] = [];

const instance = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'https://qa.redfishapp.com') + '/api',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});

// --- Request Interceptor ---
instance.interceptors.request.use(
  (config: any) => {
    const url = config.url ?? '';
    const isTokenRequired = !UNAUTH_ROUTES.includes(url);
    const token = getToken();

    const controller = new AbortController();
    controllers.push(controller);

    return {
      ...config,
      signal: controller.signal,
      timeout: API_TIMEOUT,
      headers: {
        ...config.headers,
        ...(isTokenRequired && token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
instance.interceptors.response.use(
  (response: any) => Promise.resolve(response),
  (error) => {
    if (error?.response?.status === 403) {
      removeToken();
      controllers.forEach((controller) => controller.abort());
      controllers.length = 0;
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// --- API Methods ---
const apiClient = {
  get: async (url: string, config = {}): Promise<any> => {
    return (await instance.get(url, config)).data;
  },
  post: async (url: string, data = {}, config = {}): Promise<any> => {
    return (await instance.post(url, data, config)).data;
  },
  put: async (url: string, data = {}, config = {}): Promise<any> => {
    return (await instance.put(url, data, config)).data;
  },
  patch: async (url: string, data = {}, config = {}): Promise<any> => {
    return (await instance.patch(url, data, config)).data;
  },
  delete: async (url: string, config = {}): Promise<any> => {
    return (await instance.delete(url, config)).data;
  },
};

export default apiClient; 