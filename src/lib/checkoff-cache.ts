const FORM_SETUP_CACHE_PREFIX = "qrCheckoff.formSetup";
const UNIT_SUMMARY_CACHE_PREFIX = "qrCheckoff.unitSummary";
const FORM_SETUP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const UNIT_SUMMARY_TTL_MS = 60 * 1000; // 60 seconds

type CacheTargetType = "compartment" | "kit";

type CachedFormSetup = {
  cachedAt: number;
  expiresAt: number;
  data: {
    targetType: CacheTargetType;
    sourceName: string;
    items: Array<{
      id: string;
      name: string;
      parLevel: number | null;
      inputType: string;
      sortOrder: number;
      groupId: string | null;
    }>;
    groups: Array<{
      id: string;
      name: string;
      sortOrder: number;
    }>;
  };
};

export type CachedUnitSummaryData = {
  unitId: string;
  unitName: string;
  shiftDate: string;
  shiftPeriod: string;
  completedCount: number;
  totalCount: number;
  targetStatuses: Array<{
    id: string;
    name: string;
    type: CacheTargetType;
    status: "not_started" | "in_progress" | "completed" | "incomplete" | "exception";
  }>;
};

type CachedUnitSummary = {
  cachedAt: number;
  expiresAt: number;
  data: CachedUnitSummaryData;
};

function cacheKey(unitId: string, targetType: CacheTargetType, targetId: string) {
  return `${FORM_SETUP_CACHE_PREFIX}:${unitId}:${targetType}:${targetId}`;
}

function unitSummaryCacheKey(unitId: string, shiftDate: string, shiftPeriod: string) {
  return `${UNIT_SUMMARY_CACHE_PREFIX}:${unitId}:${shiftDate}:${shiftPeriod}`;
}

export function readCachedFormSetup(unitId: string, targetType: CacheTargetType, targetId: string): CachedFormSetup | null {
  try {
    const raw = localStorage.getItem(cacheKey(unitId, targetType, targetId));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedFormSetup;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(cacheKey(unitId, targetType, targetId));
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

export function hasFreshCachedFormSetup(unitId: string, targetType: CacheTargetType, targetId: string) {
  return Boolean(readCachedFormSetup(unitId, targetType, targetId));
}

export function writeCachedFormSetup(
  unitId: string,
  targetType: CacheTargetType,
  targetId: string,
  data: CachedFormSetup["data"],
) {
  try {
    const entry: CachedFormSetup = {
      cachedAt: Date.now(),
      expiresAt: Date.now() + FORM_SETUP_TTL_MS,
      data,
    };
    localStorage.setItem(cacheKey(unitId, targetType, targetId), JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — degrade silently
  }
}

export function readCachedUnitSummary(unitId: string, shiftDate: string, shiftPeriod: string): CachedUnitSummary | null {
  try {
    const key = unitSummaryCacheKey(unitId, shiftDate, shiftPeriod);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedUnitSummary;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    if (entry.data.unitId !== unitId || entry.data.shiftDate !== shiftDate || entry.data.shiftPeriod !== shiftPeriod) {
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

export function writeCachedUnitSummary(unitId: string, shiftDate: string, shiftPeriod: string, data: CachedUnitSummaryData) {
  try {
    const entry: CachedUnitSummary = {
      cachedAt: Date.now(),
      expiresAt: Date.now() + UNIT_SUMMARY_TTL_MS,
      data,
    };
    localStorage.setItem(unitSummaryCacheKey(unitId, shiftDate, shiftPeriod), JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — degrade silently
  }
}

export function evictStaleCaches(unitId: string) {
  try {
    const prefixes = [`${FORM_SETUP_CACHE_PREFIX}:${unitId}:`, `${UNIT_SUMMARY_CACHE_PREFIX}:${unitId}:`];
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && prefixes.some((prefix) => key.startsWith(prefix))) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const entry = JSON.parse(raw) as CachedFormSetup;
            if (Date.now() > entry.expiresAt) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      }
    }
  } catch {
    // localStorage unavailable
  }
}
