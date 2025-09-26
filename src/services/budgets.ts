import { readJson, writeJson } from "@/services/storage";

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

const BUDGETS_KEY = "budgets";

export function listBudgets(): BudgetItem[] {
  return readJson<BudgetItem[]>(BUDGETS_KEY, []);
}

export function upsertBudget(input: Omit<BudgetItem, "id"> & { id?: string }): BudgetItem {
  const all = listBudgets();
  const id = input.id ?? crypto.randomUUID();
  const idx = all.findIndex(b => b.id === id);
  const item: BudgetItem = { ...input, id } as BudgetItem;
  if (idx >= 0) all[idx] = item; else all.push(item);
  writeJson(BUDGETS_KEY, all);
  return item;
}

export function deleteBudget(id: string): void {
  const all = listBudgets().filter(b => b.id !== id);
  writeJson(BUDGETS_KEY, all);
}




