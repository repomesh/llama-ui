declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

const globalStoreCache = new Map<string, unknown>();

export function getOrCreate<T>(key: string, factory: () => T): T {
  if (!globalStoreCache.has(key)) {
    globalStoreCache.set(key, factory());
  }
  return globalStoreCache.get(key) as T;
}

export function getStore<T>(key: string): T | undefined {
  return globalStoreCache.get(key) as T;
}
