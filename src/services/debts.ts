import { readJson, writeJson } from "@/services/storage";

export interface DebtItem {
  id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'student_loan' | 'mortgage' | string;
  balance: number;
  originalAmount: number; // Added this field
  interestRate: number; // APR percent, e.g., 18.99
  minimumPayment: number;
  nextPaymentDate?: string; // ISO date
}

const KEY = 'debts';

export function listDebts(): DebtItem[] {
  return readJson<DebtItem[]>(KEY, []);
}

export function upsertDebt(input: Omit<DebtItem, 'id' | 'originalAmount'> & { id?: string; originalAmount?: number }): DebtItem {
  const all = listDebts();
  const id = input.id ?? crypto.randomUUID();
  
  let item: DebtItem;
  const idx = all.findIndex(d => d.id === id);

  if (idx >= 0) {
    // Update existing debt
    item = { ...all[idx], ...input, id } as DebtItem;
    all[idx] = item;
  } else {
    // Create new debt: originalAmount is initially the same as balance
    item = { 
      ...input, 
      id, 
      originalAmount: input.originalAmount ?? input.balance // Set originalAmount for new debts
    } as DebtItem;
    all.push(item);
  }
  
  writeJson(KEY, all);
  return item;
}

export function deleteDebt(id: string): void {
  writeJson(KEY, listDebts().filter(d => d.id !== id));
}