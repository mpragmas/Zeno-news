import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/lib/types/api';
import { getAuthToken, getGuestSessionId } from '@/lib/auth/session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://newssummaryapp-api.onrender.com/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — attach the auth token (or the guest session id when
// signed out) so reading history and saved articles bind to the right owner.
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const guestId = getGuestSessionId();
      if (guestId) config.headers['x-guest-session-id'] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — unwrap errors and clear the session on auth failure.
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error) => {
    const status = error.response?.status;
    // A 401 on an authenticated call means the token is stale — sign the user out.
    if (status === 401 && getAuthToken()) {
      // Dynamic import keeps the auth store out of the server bundle.
      void import('@/lib/stores/auth.store')
        .then(({ useAuthStore }) => useAuthStore.getState().logout())
        .catch(() => undefined);
    }
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ message, statusCode: status, original: error });
  },
);

export async function fetchApi<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data.data;
}

export default apiClient;
