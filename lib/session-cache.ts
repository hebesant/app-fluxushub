type CacheEntry<T> = {
  value: T;
  updatedAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function readSessionCache<T>(key: string) {
  return (cache.get(key) as CacheEntry<T> | undefined) ?? null;
}

export function writeSessionCache<T>(key: string, value: T) {
  cache.set(key, {
    value,
    updatedAt: Date.now(),
  });
}

export function clearSessionCache(key?: string) {
  if (key) {
    cache.delete(key);
    return;
  }

  cache.clear();
}
