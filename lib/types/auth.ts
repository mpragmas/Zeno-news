import type { Lang } from './api';

export type Role = 'user' | 'admin';

/** Shape returned by POST /auth/oauth (the `user` field). */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatarUrl?: string | null;
  preferredAppLanguage: Lang;
  preferredNewsLanguage: Lang;
}

export interface NotificationPreferences {
  dailyDigest: boolean;
  breakingNews: boolean;
}

/** Shape returned by GET /me (richer than the login payload). */
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatarUrl: string | null;
  preferredAppLanguage: Lang;
  preferredNewsLanguage: Lang;
  favoriteTopics: string[];
  notificationPreferences: NotificationPreferences;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
  guestMerge?: { mergedSaves: number; mergedReads: number };
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
  preferredAppLanguage?: Lang;
  preferredNewsLanguage?: Lang;
  favoriteTopics?: string[];
  dailyDigest?: boolean;
  breakingNews?: boolean;
}
