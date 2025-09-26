import { readJson, writeJson } from "@/services/storage";
import type { CurrencyCode } from "@/types"; // Import CurrencyCode

export interface DebtItem {
  id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'student_loan' | 'mortgage' | string;
  balance: number;
  originalAmount: number;
  interestRate: number; // APR percent, e.g., 18.99
  minimumPayment: number;
  nextPaymentDate?: string; // ISO date
  currency: CurrencyCode; // Added currency
}

const KEY = 'debts';

export function listDebts(): DebtItem[] {
  return readJson<DebtItem[]>(KEY, []);
}

export function upsertDebt(input: Omit<DebtItem, 'id'> & { id?: string }): DebtItem {
  const all = listDebts();
  const id = input.id ?? crypto.randomUUID();
  const item: DebtItem = { ...input, id } as DebtItem;
  const idx = all.findIndex(d => d.id === id);
  if (idx >= 0) all[idx] = item; else all.push(item);
  writeJson(KEY, all);
  return item;
}

export function deleteDebt(id: string): void {
  writeJson(KEY, listDebts().filter(d => d.id !== id));
}