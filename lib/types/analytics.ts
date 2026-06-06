export type AnalyticsEventType =
  | 'STORY_IMPRESSION'
  | 'ARTICLE_OPEN'
  | 'SOURCE_SWITCH'
  | 'EXTERNAL_CLICK'
  | 'BOOKMARK'
  | 'UNBOOKMARK'
  | 'SHARE'
  | 'SEARCH'
  | 'SESSION_START'
  | 'SESSION_HEARTBEAT'
  | 'LANGUAGE_USAGE'
  | 'CATEGORY_INTEREST'
  | 'REGION_INTEREST';

export interface TrackEvent {
  type: AnalyticsEventType;
  sessionId: string;
  articleId?: string;
  clusterId?: string;
  source?: string;
  category?: string;
  language?: string;
  region?: string;
  query?: string;
  resultCount?: number;
  durationMs?: number;
}

// ── Admin dashboard response shapes ─────────────────────────────────────────

export interface TimeBucket {
  bucket: string;
  value: number;
}

export interface NameCount {
  name: string;
  count: number;
}

export interface DateRangeMeta {
  from: string;
  to: string;
}

export interface OverviewResponse {
  range: DateRangeMeta;
  totals: {
    totalUsers: number;
    newUsers: number;
    liveUsers: number;
    dau: number;
    wau: number;
    mau: number;
    storiesRead: number;
    outboundClicks: number;
    impressions: number;
    engagementRate: number;
    avgSessionMs: number;
    avgSessionDepth: number;
    returningUsers: number;
    newVisitors: number;
    guestUsers: number;
    registeredUsers: number;
  };
  series: {
    outboundClicks: TimeBucket[];
    activeUsers: TimeBucket[];
    storiesRead: TimeBucket[];
  };
}

export interface PublisherRow {
  source: string;
  clicks: number;
  uniqueSessions: number;
  uniqueUsers: number;
  impressions: number;
  ctr: number;
  topCategories: NameCount[];
}

export interface PublishersResponse {
  range: DateRangeMeta;
  totals: {
    clicks: number;
    impressions: number;
    uniqueUsers: number;
    ctr: number;
    publisherCount: number;
  };
  publishers: PublisherRow[];
}

export interface UsersResponse {
  range: DateRangeMeta;
  totals: {
    activeUsers: number;
    guestUsers: number;
    registeredUsers: number;
    returningUsers: number;
    newVisitors: number;
    retentionRate: number;
    avgSessionMs: number;
    avgSessionDepth: number;
  };
  breakdowns: {
    languages: NameCount[];
    countries: NameCount[];
    devices: NameCount[];
    regions: NameCount[];
    categories: NameCount[];
  };
  series: { activeUsers: TimeBucket[] };
}

export interface StoryPerformanceRow {
  clusterId: string;
  title: string;
  impressions: number;
  opens: number;
  sourceSwitches: number;
  clicks: number;
  bookmarks: number;
  shares: number;
  ctr: number;
}

export interface StoriesResponse {
  range: DateRangeMeta;
  stories: StoryPerformanceRow[];
}

export interface SearchResponse {
  range: DateRangeMeta;
  totals: {
    totalSearches: number;
    failedSearches: number;
    successRate: number;
  };
  topSearches: NameCount[];
  failedSearches: NameCount[];
  trending: NameCount[];
}
