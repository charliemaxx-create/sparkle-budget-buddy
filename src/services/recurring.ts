import { readJson, writeJson } from "@/services/storage";

export type RecurringFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface RecurringItem {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: RecurringFrequency;
  start_date: string; // ISO date
  end_date?: string; // ISO date
  next_execution_date: string; // ISO date
  last_executed_date?: string; // ISO date
  is_active: boolean;
  account_id?: string;
  tags?: string[];
}

const KEY = 'recurring';

export function listRecurring(): RecurringItem[] {
  return readJson<RecurringItem[]>(KEY, []);
}

export function upsertRecurring(input: Omit<RecurringItem, 'id' | 'next_execution_date'> & { id?: string; next_execution_date?: string }): RecurringItem {
  const all = listRecurring();
  const id = input.id ?? crypto.randomUUID();
  const base: RecurringItem = {
    ...input,
    id,
    next_execution_date: input.next_execution_date ?? computeNextExecutionDate(input.start_date, input.frequency, input.last_executed_date),
  } as RecurringItem;
  const idx = all.findIndex(r => r.id === id);
  if (idx >= 0) all[idx] = base; else all.push(base);
  writeJson(KEY, all);
  return base;
}

export function deleteRecurring(id: string): void {
  const all = listRecurring().filter(r => r.id !== id);
  writeJson(KEY, all);
}

export function setRecurringActive(id: string, active: boolean): void {
  const all = listRecurring();
  const idx = all.findIndex(r => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], is_active: active };
    writeJson(KEY, all);
  }
}

function computeNextExecutionDate(startIso: string, frequency: RecurringFrequency, lastExecutedIso?: string): string {
  const base = new Date(lastExecutedIso ?? startIso);
  const next = new Date(base);
  switch (frequency) {
    case 'daily':
      next.setDate(base.getDate() + 1); break;
    case 'weekly':
      next.setDate(base.getDate() + 7); break;
    case 'bi-weekly':
      next.setDate(base.getDate() + 14); break;
    case 'monthly':
      next.setMonth(base.getMonth() + 1); break;
    case 'quarterly':
      next.setMonth(base.getMonth() + 3); break;
    case 'yearly':
      next.setFullYear(base.getFullYear() + 1); break;
  }
  return next.toISOString();
}




