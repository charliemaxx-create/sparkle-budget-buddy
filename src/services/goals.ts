import { readJson, writeJson } from "@/services/storage";
import type { CurrencyCode } from "@/types"; // Import CurrencyCode

export interface SavingsGoalItem {
  id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string; // ISO
  category?: string;
  icon: string;
  color: string;
  is_active: boolean;
  currency: CurrencyCode; // Added currency
}

const KEY = "savings_goals";

export function listGoals(): SavingsGoalItem[] {
  return readJson<SavingsGoalItem[]>(KEY, []);
}

export function upsertGoal(input: Omit<SavingsGoalItem, "id"> & { id?: string }): SavingsGoalItem {
  const all = listGoals();
  const id = input.id ?? crypto.randomUUID();
  const next: SavingsGoalItem = { ...input, id } as SavingsGoalItem;
  const idx = all.findIndex(g => g.id === id);
  if (idx >= 0) all[idx] = next; else all.push(next);
  writeJson(KEY, all);
  return next;
}

export function deleteGoal(id: string): void {
  writeJson(KEY, listGoals().filter(g => g.id !== id));
}

// Simple projection: given a fixed monthly contribution, compute estimated date to reach target
export function projectGoalCompletionDate(goal: SavingsGoalItem, monthlyContribution: number): string | null {
  if (monthlyContribution <= 0) return null;
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  if (remaining === 0) return new Date().toISOString();
  const months = Math.ceil(remaining / monthlyContribution);
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}