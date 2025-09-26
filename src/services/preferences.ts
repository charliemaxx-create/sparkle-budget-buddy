import { readJson, writeJson } from "@/services/storage";
import type { UserPreferences } from "@/types";

const KEY = "user_preferences";

const defaultPreferences: UserPreferences = {
  id: "default-user", // In a real app, this would be the actual user ID
  defaultCurrency: "USD",
  locale: "en-US",
  weekStartsOn: 0, // Sunday
  theme: "system",
};

export function getUserPreferences(): UserPreferences {
  return readJson<UserPreferences>(KEY, defaultPreferences);
}

export function upsertUserPreferences(input: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences();
  const updated = { ...current, ...input };
  writeJson(KEY, updated);
  return updated;
}