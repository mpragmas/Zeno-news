export type Lang = 'en' | 'fr' | 'rw';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

export interface StoriesParams {
  lang?: Lang;
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  continent?: string;
  region?: string;
  query?: string;
}

export interface ArticlesParams {
  lang?: Lang;
  page?: number;
  limit?: number;
}
