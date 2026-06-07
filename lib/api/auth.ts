import apiClient, { fetchApi } from './client';
import type { ApiResponse } from '@/lib/types/api';
import type {
  AuthResponse,
  UpdateProfileInput,
  UserProfile,
} from '@/lib/types/auth';
import type { Article } from '@/lib/types/article';

export interface SavedArticle extends Article {
  savedAt: string;
}

export interface HistoryArticle extends Article {
  readAt: string;
}

/** Exchange a Google ID token for an API JWT (and merge guest data if provided). */
export async function loginWithGoogle(
  idToken: string,
  mergeFromGuestSessionId?: string,
): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/oauth', {
    idToken,
    ...(mergeFromGuestSessionId ? { mergeFromGuestSessionId } : {}),
  });
  return res.data.data;
}

/**
 * Admin-only username/password sign-in. There is no signup counterpart —
 * admin accounts are pre-provisioned. Regular users authenticate with Google.
 */
export async function loginWithCredentials(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/admin/login', {
    username,
    password,
  });
  return res.data.data;
}

export function getMe(): Promise<UserProfile> {
  return fetchApi<UserProfile>('/me');
}

export async function updateMe(input: UpdateProfileInput): Promise<UserProfile> {
  const res = await apiClient.patch<ApiResponse<UserProfile>>('/me', input);
  return res.data.data;
}

export function getSavedArticles(lang?: string): Promise<SavedArticle[]> {
  return fetchApi<SavedArticle[]>(
    `/me/saved-articles${lang ? `?lang=${lang}` : ''}`,
  );
}

export function getReadingHistory(lang?: string): Promise<HistoryArticle[]> {
  return fetchApi<HistoryArticle[]>(`/me/history${lang ? `?lang=${lang}` : ''}`);
}

/** Save / unsave an article for the signed-in user (backend is article-scoped). */
export async function saveArticle(articleId: string): Promise<void> {
  await apiClient.post(`/articles/${articleId}/save`);
}

export async function unsaveArticle(articleId: string): Promise<void> {
  await apiClient.delete(`/articles/${articleId}/save`);
}
