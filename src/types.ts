// Core domain types for finance data models

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "NGN"
  | (string & {});

export type AccountType =
  | "checking"
  | "savings"
  | "cash"
  | "credit"
  | "investment"
  | "loan"
  | (string & {});

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  balance: number;
  institution?: string;
  lastUpdatedIso?: string; // ISO timestamp
  isArchived?: boolean;
}

export type TransactionType = "income" | "expense" | "transfer";

export interface TransactionSplit {
  id: string;
  amount: number; // positive number, sign determined by parent type
  categoryId?: string;
  memo?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number; // positive number; sign semantics come from type
  currency: CurrencyCode;
  dateIso: string; // posting/transaction date ISO
  description?: string;
  merchant?: string;
  categoryId?: string;
  tags?: string[];
  notes?: string;
  cleared?: boolean;
  pending?: boolean;
  attachments?: string[]; // URLs or storage keys
  splits?: TransactionSplit[];
  createdAtIso?: string;
  updatedAtIso?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string; // optional hierarchy
  colorHex?: string;
  isHidden?: boolean;
}

export interface BudgetCategoryAllocation {
  categoryId: string;
  amount: number; // allocation for the period's category
}

export interface BudgetPeriod {
  id: string;
  year: number; // e.g., 2025
  month: number; // 1-12
  currency: CurrencyCode;
  allocations: BudgetCategoryAllocation[];
  rolloverEnabled?: boolean;
}

export interface RecurringSchedule {
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  interval?: number; // every N units (default 1)
  byMonthDay?: number; // for monthly/yearly
  byWeekday?: number; // 0-6 (Sun-Sat)
  startDateIso: string;
  endDateIso?: string;
}

export interface RecurringTransactionTemplate {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  description?: string;
  merchant?: string;
  categoryId?: string;
  tags?: string[];
  schedule: RecurringSchedule;
  isActive: boolean;
  lastGeneratedOnIso?: string;
}

export interface ImportPreviewRow {
  rowIndex: number;
  raw: Record<string, string>;
  parsed: Partial<Transaction>;
  isValid: boolean;
  issues?: string[];
}

export interface UserPreferences {
  id: string;
  defaultCurrency: CurrencyCode;
  locale: string; // e.g., en-US
  weekStartsOn: 0 | 1; // Sunday(0) or Monday(1)
  theme?: "light" | "dark" | "system";
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}




