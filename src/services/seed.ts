import { mockDb } from "@/services/mockDb";
import { listBudgets, upsertBudget } from "@/services/budgets";
import { listRecurring, upsertRecurring } from "@/services/recurring";
import { listRules, upsertRule } from "@/services/rules";
import { listGoals, upsertGoal } from "@/services/goals";
import { listDebts, upsertDebt } from "@/services/debts";

export function seedMockData(): void {
  const accounts = mockDb.listAccounts();
  if (accounts.length === 0) {
    mockDb.upsertAccount({
      name: "Main Checking",
      type: "checking",
      currency: "USD",
      balance: 4250.75,
      institution: "Bank of America",
    });
    mockDb.upsertAccount({
      name: "Emergency Savings",
      type: "savings",
      currency: "USD",
      balance: 12800.50,
      institution: "Ally Bank",
    });
    mockDb.upsertAccount({
      name: "Travel Credit Card",
      type: "credit_card",
      currency: "USD",
      balance: -1250.25,
      institution: "Chase",
    });
    mockDb.upsertAccount({
      name: "Cash Wallet",
      type: "cash",
      currency: "USD",
      balance: 150.00,
      institution: "Personal",
    });
    mockDb.upsertAccount({
      name: "Investment Portfolio",
      type: "investment",
      currency: "EUR", // Example of a different currency
      balance: 20000.00,
      institution: "Fidelity Europe",
    });
    mockDb.upsertAccount({
      name: "Mortgage Loan",
      type: "loan",
      currency: "USD",
      balance: -250000.00,
      institution: "Wells Fargo",
    });
    mockDb.upsertAccount({
      name: "Personal Liability",
      type: "liability",
      currency: "GBP", // Example of a different currency
      balance: -500.00,
      institution: "Friend",
    });
  }

  const budgets = listBudgets();
  if (budgets.length === 0) {
    upsertBudget({ category: 'Food & Dining', allocated: 800, spent: 645, icon: '🍽️', color: '#10B981', currency: 'USD' });
    upsertBudget({ category: 'Transportation', allocated: 400, spent: 320, icon: '🚗', color: '#6366F1', currency: 'USD' });
    upsertBudget({ category: 'Entertainment', allocated: 300, spent: 380, icon: '🎬', color: '#F59E0B', currency: 'USD' });
    upsertBudget({ category: 'Shopping', allocated: 500, spent: 290, icon: '🛍️', color: '#EF4444', currency: 'USD' });
    upsertBudget({ category: 'European Travel', allocated: 1000, spent: 200, icon: '✈️', color: '#06B6D4', currency: 'EUR' });
  }

  const recurring = listRecurring();
  if (recurring.length === 0) {
    upsertRecurring({
      name: 'Salary',
      description: 'Monthly salary payment',
      amount: 5000,
      type: 'income',
      category: 'Salary',
      frequency: 'monthly',
      start_date: new Date().toISOString(),
      is_active: true,
      last_executed_date: undefined,
      currency: 'USD',
    });
    upsertRecurring({
      name: 'Rent',
      description: 'Monthly apartment rent',
      amount: 1200,
      type: 'expense',
      category: 'Housing',
      frequency: 'monthly',
      start_date: new Date().toISOString(),
      is_active: true,
      last_executed_date: undefined,
      currency: 'USD',
    });
    upsertRecurring({
      name: 'Gym Membership',
      description: 'Monthly gym fee',
      amount: 50,
      type: 'expense',
      category: 'Healthcare',
      frequency: 'monthly',
      start_date: new Date().toISOString(),
      is_active: true,
      last_executed_date: undefined,
      currency: 'USD',
    });
    upsertRecurring({
      name: 'Freelance Income (EUR)',
      description: 'Monthly freelance payment from EU client',
      amount: 1000,
      type: 'income',
      category: 'Freelance',
      frequency: 'monthly',
      start_date: new Date().toISOString(),
      is_active: true,
      last_executed_date: undefined,
      currency: 'EUR',
    });
  }

  const rules = listRules();
  if (rules.length === 0) {
    upsertRule({
      name: 'Groceries -> Food',
      match: { descriptionRegex: 'grocery|supermarket|whole foods|kroger|aldi|safeway' },
      actions: { setCategoryId: 'Food & Dining', addTags: ['groceries'] },
      enabled: true,
      order: 10,
    });
    upsertRule({
      name: 'Uber/Lyft -> Transportation',
      match: { merchantContains: 'uber' },
      actions: { setCategoryId: 'Transportation', addTags: ['rideshare'] },
      enabled: true,
      order: 20,
    });
  }

  const goals = listGoals();
  if (goals.length === 0) {
    upsertGoal({
      name: 'Emergency Fund',
      description: '6 months of expenses',
      target_amount: 15000,
      current_amount: 8500,
      target_date: undefined,
      category: 'Emergency Fund',
      icon: '🛡️',
      color: '#10B981',
      is_active: true,
      currency: 'USD',
    });
    upsertGoal({
      name: 'Vacation to Europe',
      description: 'Family trip',
      target_amount: 5000,
      current_amount: 1200,
      target_date: undefined,
      category: 'Vacation',
      icon: '✈️',
      color: '#6366F1',
      is_active: true,
      currency: 'EUR', // Example of a different currency
    });
    upsertGoal({
      name: 'New Car Down Payment',
      description: 'Saving for a new car',
      target_amount: 10000,
      current_amount: 3000,
      target_date: undefined,
      category: 'Car',
      icon: '🚗',
      color: '#F97316',
      is_active: true,
      currency: 'USD',
    });
  }

  const debts = listDebts();
  if (debts.length === 0) {
    upsertDebt({ name: 'Credit Card', type: 'credit_card', balance: 3250.75, originalAmount: 5000, interestRate: 18.99, minimumPayment: 125, nextPaymentDate: undefined, currency: 'USD' });
    upsertDebt({ name: 'Student Loan', type: 'student_loan', balance: 12450.50, originalAmount: 15000, interestRate: 4.5, minimumPayment: 280, nextPaymentDate: undefined, currency: 'USD' });
    upsertDebt({ name: 'Auto Loan', type: 'loan', balance: 8400, originalAmount: 10000, interestRate: 6.9, minimumPayment: 260, nextPaymentDate: undefined, currency: 'USD' });
    upsertDebt({ name: 'Personal Loan (GBP)', type: 'personal_loan', balance: 750, originalAmount: 1000, interestRate: 12.0, minimumPayment: 50, nextPaymentDate: undefined, currency: 'GBP' });
  }
}