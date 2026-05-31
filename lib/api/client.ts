import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/lib/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://newssummaryapp-api.onrender.com/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — unwrap the API envelope
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const statusCode = error.response?.status;
    return Promise.reject({ message, statusCode, original: error });
  }
);

export async function fetchApi<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data.data;
}

export default apiClient;
