import { readJson, writeJson } from "@/services/storage";
import type { CurrencyCode } from "@/types"; // Import CurrencyCode

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  currency: CurrencyCode; // Added currency
}

const BUDGETS_KEY = "budgets";

export function listBudgets(): BudgetItem[] {
  return readJson<BudgetItem[]>(BUDGETS_KEY, []);
}

export function upsertBudget(input: Omit<BudgetItem, "id"> & { id?: string }): BudgetItem {
  const all = listBudgets();
  const id = input.id ?? crypto.randomUUID();
  const item: BudgetItem = { ...input, id } as BudgetItem;
  const idx = all.findIndex(b => b.id === id); // Correctly define idx here
  if (idx >= 0) all[idx] = item; else all.push(item);
  writeJson(BUDGETS_KEY, all);
  return item;
}

export function deleteBudget(id: string): void {
  const all = listBudgets().filter(b => b.id !== id);
  writeJson(BUDGETS_KEY, all);
}