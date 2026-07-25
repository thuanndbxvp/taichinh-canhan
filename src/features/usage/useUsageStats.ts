/**
 * useUsageStats — React hook đọc usage stats từ localStorage.
 * Hook này không subscribe — UI gọi refresh() sau mỗi lần user mở modal
 * hoặc dùng interval để poll.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  clearUsage,
  getUsageEntries,
  getUsageTotals,
  type UsageEntry,
  type UsageTotals,
} from '../../services/usage/usageTracker';

export interface UseUsageStatsResult {
  totals: UsageTotals;
  entries: UsageEntry[];
  refresh: () => void;
  clear: () => void;
}

export function useUsageStats(): UseUsageStatsResult {
  const [totals, setTotals] = useState<UsageTotals>(() => getUsageTotals());
  const [entries, setEntries] = useState<UsageEntry[]>(() => getUsageEntries());

  const refresh = useCallback(() => {
    setTotals(getUsageTotals());
    setEntries(getUsageEntries());
  }, []);

  const clear = useCallback(() => {
    clearUsage();
    refresh();
  }, [refresh]);

  // Refresh khi tab focus lại (đảm bảo sync với action từ tab khác).
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, [refresh]);

  return { totals, entries, refresh, clear };
}
