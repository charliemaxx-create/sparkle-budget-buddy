import { readJson, writeJson } from "@/services/storage";
import type { Transaction } from "@/types";

export interface CategorizationRule {
  id: string;
  name: string;
  match: {
    merchantContains?: string;
    descriptionRegex?: string;
  };
  actions: {
    setCategoryId?: string;
    addTags?: string[];
    setType?: Transaction["type"];
  };
  enabled: boolean;
  order: number;
}

const KEY = "rules";

export function listRules(): CategorizationRule[] {
  return readJson<CategorizationRule[]>(KEY, []);
}

export function upsertRule(input: Omit<CategorizationRule, "id"> & { id?: string }): CategorizationRule {
  const all = listRules();
  const id = input.id ?? crypto.randomUUID();
  const idx = all.findIndex(r => r.id === id);
  const rule: CategorizationRule = { ...input, id } as CategorizationRule;
  if (idx >= 0) all[idx] = rule; else all.push(rule);
  all.sort((a, b) => a.order - b.order);
  writeJson(KEY, all);
  return rule;
}

export function deleteRule(id: string): void {
  const next = listRules().filter(r => r.id !== id);
  writeJson(KEY, next);
}

export function applyRules(transaction: Transaction): Transaction {
  const rules = listRules().filter(r => r.enabled).sort((a, b) => a.order - b.order);
  let updated: Transaction = { ...transaction };
  for (const r of rules) {
    const merchant = (updated.merchant ?? updated.description ?? "").toLowerCase();
    const desc = (updated.description ?? "").toLowerCase();
    let matched = false;
    if (r.match.merchantContains) {
      matched ||= merchant.includes(r.match.merchantContains.toLowerCase());
    }
    if (r.match.descriptionRegex) {
      try {
        const re = new RegExp(r.match.descriptionRegex, "i");
        matched ||= re.test(desc);
      } catch {
        // ignore invalid regex
      }
    }
    if (!matched) continue;

    if (r.actions.setCategoryId) updated.categoryId = r.actions.setCategoryId;
    if (r.actions.setType) updated.type = r.actions.setType;
    if (r.actions.addTags && r.actions.addTags.length > 0) {
      const set = new Set([...(updated.tags ?? []), ...r.actions.addTags]);
      updated.tags = Array.from(set);
    }
  }
  return updated;
}



