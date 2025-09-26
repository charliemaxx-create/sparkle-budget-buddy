import { mockDb } from "@/services/mockDb";
import { listBudgets, upsertBudget } from "@/services/budgets";
import { listRecurring, upsertRecurring } from "@/services/recurring";
import { listRules, upsertRule } from "@/services/rules";
import { listGoals, upsertGoal } from "@/services/goals";
import { listDebts, upsertDebt } from "@/services/debts";
import { supabase } from "@/integrations/supabase/client";

export async function seedMockData(): Promise<void> {
  const accounts = mockDb.listAccounts();
  if (accounts.length === 0) {
    mockDb.upsertAccount({
      name: "Checking Account",
      type: "checking",
      currency: "USD",
      balance: 2500,
      institution: "Demo Bank",
    });
    mockDb.upsertAccount({
      name: "Savings Account",
      type: "savings",
      currency: "USD",
      balance: 8000,
      institution: "Demo Bank",
    });
  }

  const budgets = listBudgets();
  if (budgets.length === 0) {
    upsertBudget({ category: 'Food & Dining', allocated: 800, spent: 645, icon: '🍽️', color: '#10B981' });
    upsertBudget({ category: 'Transportation', allocated: 400, spent: 320, icon: '🚗', color: '#6366F1' });
    upsertBudget({ category: 'Entertainment', allocated: 300, spent: 380, icon: '🎬', color: '#F59E0B' });
    upsertBudget({ category: 'Shopping', allocated: 500, spent: 290, icon: '🛍️', color: '#EF4444' });
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
    });
  }

  const debts = listDebts();
  if (debts.length === 0) {
    upsertDebt({ name: 'Credit Card', type: 'credit_card', balance: 3250.75, originalAmount: 5000, interestRate: 18.99, minimumPayment: 125, nextPaymentDate: undefined });
    upsertDebt({ name: 'Student Loan', type: 'student_loan', balance: 12450.50, originalAmount: 15000, interestRate: 4.5, minimumPayment: 280, nextPaymentDate: undefined });
    upsertDebt({ name: 'Auto Loan', type: 'loan', balance: 8400, originalAmount: 10000, interestRate: 6.9, minimumPayment: 260, nextPaymentDate: undefined });
  }

  // Seed 50-30-20 budget strategy and allocations
  const { data: existingStrategy } = await supabase
    .from('budget_strategies')
    .select('*')
    .eq('strategy_type', '50-30-20')
    .single();

  if (!existingStrategy) {
    const { data: newStrategy, error: strategyError } = await supabase
      .from('budget_strategies')
      .insert({
        name: '50-30-20 Rule',
        strategy_type: '50-30-20',
        is_active: true,
        monthly_income: 5000,
      })
      .select()
      .single();

    if (strategyError) {
      console.error('Error seeding 50-30-20 strategy:', strategyError);
    } else if (newStrategy) {
      const defaultAllocations = [
        { category_name: 'Needs', percentage_of_income: 0.50, allocated_amount: 5000 * 0.50, spent_amount: 0, remaining_amount: 5000 * 0.50, category_type: '50-30-20', strategy_id: newStrategy.id },
        { category_name: 'Wants', percentage_of_income: 0.30, allocated_amount: 5000 * 0.30, spent_amount: 0, remaining_amount: 5000 * 0.30, category_type: '50-30-20', strategy_id: newStrategy.id },
        { category_name: 'Savings', percentage_of_income: 0.20, allocated_amount: 5000 * 0.20, spent_amount: 0, remaining_amount: 5000 * 0.20, category_type: '50-30-20', strategy_id: newStrategy.id },
      ];
      const { error: allocationsError } = await supabase
        .from('budget_allocations')
        .insert(defaultAllocations);
      if (allocationsError) {
        console.error('Error seeding 50-30-20 allocations:', allocationsError);
      }
    }
  }
}