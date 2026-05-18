const CACHE_PREFIX = "qrCheckoff.formSetup";
const TTL_MS = 10 * 60 * 1000; // 10 minutes

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

function cacheKey(unitId: string, targetType: CacheTargetType, targetId: string) {
  return `${CACHE_PREFIX}:${unitId}:${targetType}:${targetId}`;
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

export function writeCachedFormSetup(
  unitId: string,
  targetType: CacheTargetType,
  targetId: string,
  data: CachedFormSetup["data"],
) {
  try {
    const entry: CachedFormSetup = {
      cachedAt: Date.now(),
      expiresAt: Date.now() + TTL_MS,
      data,
    };
    localStorage.setItem(cacheKey(unitId, targetType, targetId), JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — degrade silently
  }
}

export function evictStaleCaches(unitId: string) {
  try {
    const prefix = `${CACHE_PREFIX}:${unitId}:`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
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
