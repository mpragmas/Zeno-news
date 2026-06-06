'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export interface RangePreset {
  key: string;
  label: string;
  days: number;
  interval: 'day' | 'hour';
}

export const RANGE_PRESETS: RangePreset[] = [
  { key: '24h', label: 'Last 24h', days: 1, interval: 'hour' },
  { key: '7d', label: 'Last 7 days', days: 7, interval: 'day' },
  { key: '30d', label: 'Last 30 days', days: 30, interval: 'day' },
  { key: '90d', label: 'Last 90 days', days: 90, interval: 'day' },
];

interface AdminFilterValue {
  preset: RangePreset;
  setPresetKey: (key: string) => void;
  days: number;
  interval: 'day' | 'hour';
}

const AdminFilterContext = createContext<AdminFilterValue | null>(null);

export function AdminFilterProvider({ children }: { children: React.ReactNode }) {
  const [presetKey, setPresetKey] = useState('30d');
  const preset = useMemo(
    () => RANGE_PRESETS.find((p) => p.key === presetKey) ?? RANGE_PRESETS[2],
    [presetKey],
  );
  const value = useMemo<AdminFilterValue>(
    () => ({ preset, setPresetKey, days: preset.days, interval: preset.interval }),
    [preset],
  );
  return <AdminFilterContext.Provider value={value}>{children}</AdminFilterContext.Provider>;
}

export function useAdminFilter(): AdminFilterValue {
  const ctx = useContext(AdminFilterContext);
  if (!ctx) {
    throw new Error('useAdminFilter must be used within an AdminFilterProvider');
  }
  return ctx;
}
