/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_TIMEOUT, AUTH_TOKEN_KEY, UNAUTH_ROUTES } from "../constants";

// Token helpers
export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

const controllers: AbortController[] = [];

const instance = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL || "https://qa.redfishapp.com") + "/api",
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// --- Request Interceptor ---
instance.interceptors.request.use(
  (config: any) => {
    const url = config.url ?? "";
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
        ...(isTokenRequired && token
          ? { Authorization: `Bearer ${token}` }
          : {}),
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
  // Specialized method for file uploads with extended timeout
  postWithFiles: async (url: string, data = {}, config = {}): Promise<any> => {
    const uploadConfig = {
      ...config,
      timeout: 300000, // 5 minutes for file uploads
      headers: {
        "Content-Type": "application/json",
        ...(config as any).headers,
      },
    };
    return (await instance.post(url, data, uploadConfig)).data;
  },
  // Method for long-running operations with retry logic
  postWithRetry: async (
    url: string,
    data = {},
    maxRetries = 3,
    config = {}
  ): Promise<any> => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const retryConfig = {
          ...config,
          timeout: 300000, // 5 minutes per attempt
          headers: {
            "Content-Type": "application/json",
            ...(config as any).headers,
          },
        };

        console.log(`API attempt ${attempt}/${maxRetries} for ${url}`);
        return (await instance.post(url, data, retryConfig)).data;
      } catch (error: any) {
        lastError = error;
        console.warn(
          `API attempt ${attempt}/${maxRetries} failed:`,
          error?.message || error
        );

        // Don't retry on client errors (4xx), only on server errors or timeouts
        if (
          error?.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          throw error; // Client error, don't retry
        }

        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Cap at 10 seconds
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
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
