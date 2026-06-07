import axios, { type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/lib/types/api';
import { getAuthToken } from '@/lib/stores/auth.store';
import type {
  OverviewResponse,
  PublishersResponse,
  UsersResponse,
  StoriesResponse,
  SearchResponse,
} from '@/lib/types/analytics';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://newssummaryapp-api.onrender.com/api/v1';

const ADMIN_KEY_STORAGE = 'newssummary-admin-key';

export function getAdminKey(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ADMIN_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function setAdminKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

const adminClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

adminClient.interceptors.request.use((config) => {
  // Prefer the signed-in admin's JWT; fall back to a manually-entered admin key.
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const key = getAdminKey();
    if (key) config.headers['X-Admin-Key'] = key;
  }
  return config;
});

export class AdminAuthError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'AdminAuthError';
  }
}

async function adminGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const res = await adminClient.get<ApiResponse<T>>(url, config);
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
      throw new AdminAuthError();
    }
    throw err;
  }
}

/** Build the date-range query params shared by every endpoint. */
export interface AdminQuery {
  days?: number;
  from?: string;
  to?: string;
  interval?: 'day' | 'hour';
  limit?: number;
  source?: string;
}

function qs(query: AdminQuery = {}): string {
  const params = new URLSearchParams();
  if (query.days) params.set('days', String(query.days));
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.interval) params.set('interval', query.interval);
  if (query.limit) params.set('limit', String(query.limit));
  if (query.source) params.set('source', query.source);
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function verifyAdminKey(key: string): Promise<boolean> {
  try {
    await axios.get<ApiResponse<{ ok: boolean }>>(`${BASE_URL}/analytics/verify`, {
      headers: { 'X-Admin-Key': key },
      timeout: 15000,
    });
    return true;
  } catch {
    return false;
  }
}

export const adminApi = {
  overview: (q: AdminQuery) => adminGet<OverviewResponse>(`/analytics/overview${qs(q)}`),
  publishers: (q: AdminQuery) =>
    adminGet<PublishersResponse>(`/analytics/publishers${qs(q)}`),
  users: (q: AdminQuery) => adminGet<UsersResponse>(`/analytics/users${qs(q)}`),
  stories: (q: AdminQuery) => adminGet<StoriesResponse>(`/analytics/stories${qs(q)}`),
  search: (q: AdminQuery) => adminGet<SearchResponse>(`/analytics/search${qs(q)}`),
};
