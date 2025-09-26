import type { DebtItem } from "@/services/debts";

export type Strategy = 'snowball' | 'avalanche';

export interface PlanStep {
  monthIndex: number; // 0-based from now
  debtId: string;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface DebtPlanResult {
  steps: PlanStep[];
  monthsToPayoff: number;
  interestPaidTotal: number;
}

// Simple planner: assumes a fixed extraPayment on top of sum(minimums), pays target debt first by strategy
export function buildDebtPlan(debts: DebtItem[], extraPayment: number, strategy: Strategy): DebtPlanResult {
  const clone = debts.map(d => ({ ...d }));
  const monthlyRates = new Map<string, number>(clone.map(d => [d.id, d.interestRate / 100 / 12]));
  let steps: PlanStep[] = [];
  let month = 0;
  let interestPaidTotal = 0;

  const isDone = () => clone.every(d => d.balance <= 0.005);

  while (month < 600 && !isDone()) { // cap at 50 years
    // Choose target debt
    const active = clone.filter(d => d.balance > 0);
    let target: DebtItem | undefined;
    if (strategy === 'snowball') {
      target = active.slice().sort((a, b) => a.balance - b.balance)[0];
    } else {
      // avalanche: highest APR first
      target = active.slice().sort((a, b) => b.interestRate - a.interestRate)[0];
    }
    if (!target) break;

    // Apply interest for the month
    for (const d of clone) {
      if (d.balance <= 0) continue;
      const i = d.balance * (monthlyRates.get(d.id) ?? 0);
      d.balance += i;
      interestPaidTotal += i;
    }

    // Total payment allocation
    const minimums = active.reduce((s, d) => s + d.minimumPayment, 0);
    let remainingBudget = extraPayment + minimums;

    for (const d of active) {
      const pay = Math.min(d.minimumPayment, d.balance);
      const principalBefore = d.balance;
      d.balance = Math.max(0, d.balance - pay);
      steps.push({
        monthIndex: month,
        debtId: d.id,
        payment: pay,
        principalPaid: Math.min(pay, principalBefore),
        interestPaid: 0, // interest accounted globally
        remainingBalance: d.balance,
      });
      remainingBudget -= pay;
    }

    if (remainingBudget > 0 && target.balance > 0) {
      const extra = Math.min(remainingBudget, target.balance);
      const principalBefore = target.balance;
      target.balance = Math.max(0, target.balance - extra);
      steps.push({
        monthIndex: month,
        debtId: target.id,
        payment: extra,
        principalPaid: Math.min(extra, principalBefore),
        interestPaid: 0,
        remainingBalance: target.balance,
      });
    }

    month++;
  }

  return { steps, monthsToPayoff: month, interestPaidTotal: Number(interestPaidTotal.toFixed(2)) };
}



