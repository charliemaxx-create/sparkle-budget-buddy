import { Account, Transaction, PagedResult } from "@/types";
import { readJson, writeJson } from "./storage";
import { applyRules } from "@/services/rules";

const ACCOUNTS_KEY = "accounts";
const TRANSACTIONS_KEY = "transactions";

export type IdGenerator = () => string;

const defaultId: IdGenerator = () => crypto.randomUUID();

export interface MockDbOptions {
  idGenerator?: IdGenerator;
}

export class MockDb {
  private readonly generateId: IdGenerator;

  constructor(options?: MockDbOptions) {
    this.generateId = options?.idGenerator ?? defaultId;
  }

  // Accounts
  listAccounts(): Account[] {
    return readJson<Account[]>(ACCOUNTS_KEY, []);
  }

  upsertAccount(input: Omit<Account, "id"> & { id?: string }): Account {
    const accounts = this.listAccounts();
    const now = new Date().toISOString();
    let account: Account;
    if (input.id) {
      const idx = accounts.findIndex(a => a.id === input.id);
      account = { ...accounts[idx], ...input, id: input.id, lastUpdatedIso: now } as Account;
      if (idx >= 0) accounts[idx] = account;
      else accounts.push(account);
    } else {
      account = { ...input, id: this.generateId(), lastUpdatedIso: now } as Account;
      accounts.push(account);
    }
    writeJson(ACCOUNTS_KEY, accounts);
    return account;
  }

  deleteAccount(id: string): void {
    const accounts = this.listAccounts().filter(a => a.id !== id);
    writeJson(ACCOUNTS_KEY, accounts);
  }

  // Transactions
  listTransactions(params?: { accountId?: string; page?: number; pageSize?: number }): PagedResult<Transaction> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 50;
    const all = readJson<Transaction[]>(TRANSACTIONS_KEY, []);
    const filtered = params?.accountId ? all.filter(t => t.accountId === params.accountId) : all;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { items, total: filtered.length, page, pageSize };
  }

  upsertTransaction(input: Omit<Transaction, "id"> & { id?: string }): Transaction {
    const all = readJson<Transaction[]>(TRANSACTIONS_KEY, []);
    const now = new Date().toISOString();
    let tx: Transaction;
    if (input.id) {
      const idx = all.findIndex(t => t.id === input.id);
      tx = applyRules({ ...all[idx], ...input, id: input.id, updatedAtIso: now } as Transaction);
      if (idx >= 0) all[idx] = tx; else all.push(tx);
    } else {
      tx = applyRules({ ...input, id: this.generateId(), createdAtIso: now, updatedAtIso: now } as Transaction);
      all.push(tx);
    }
    writeJson(TRANSACTIONS_KEY, all);
    return tx;
  }

  deleteTransaction(id: string): void {
    const all = readJson<Transaction[]>(TRANSACTIONS_KEY, []);
    writeJson(TRANSACTIONS_KEY, all.filter(t => t.id !== id));
  }
}

export const mockDb = new MockDb();



