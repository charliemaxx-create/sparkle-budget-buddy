// Local storage utility with JSON serialization and namespacing

const NAMESPACE_PREFIX = "sparkle-budget-buddy";

function buildKey(key: string): string {
  return `${NAMESPACE_PREFIX}:${key}`;
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch {
    // ignore write errors in mock storage
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(buildKey(key));
  } catch {
    // ignore
  }
}




