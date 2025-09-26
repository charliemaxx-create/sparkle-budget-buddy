import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { AccountCard } from '@/components/AccountCard';
import { BudgetCard } from '@/components/BudgetCard';
import { useBudgets } from '@/hooks/useBudgets';
import { DebtCard } from '@/components/DebtCard';
import { DebtPlanner } from '@/components/debts/DebtPlanner';
import { SpendingChart } from '@/components/SpendingChart';
import { CashflowSummary } from '@/components/insights/CashflowSummary';
import { CategoryBreakdown } from '@/components/insights/CategoryBreakdown';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { useGoals, useUpsertGoal } from '@/hooks/useGoals';
import { AddSavingsGoalModal } from '@/components/AddSavingsGoalModal';
import { RecurringTransactionCard } from '@/components/RecurringTransactionCard';
import { AddRecurringTransactionModal } from '@/components/AddRecurringTransactionModal';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { useRecurring, useDeleteRecurring, useToggleRecurring, useUpsertRecurring } from '@/hooks/useRecurring';
import { BudgetStrategyManager } from '@/components/budgeting/BudgetStrategyManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target, RotateCcw } from 'lucide-react';

// Mock data
const accounts = [
  { id: '1', name: 'Chase Checking', type: 'checking' as const, balance: 4250.75, lastUpdated: '2 hours ago' },
  { id: '2', name: 'Savings Account', type: 'savings' as const, balance: 12800.50, lastUpdated: '1 day ago' },
  { id: '3', name: 'Credit Card', type: 'credit' as const, balance: -1250.25, lastUpdated: '3 hours ago' },
  { id: '4', name: 'Cash Wallet', type: 'cash' as const, balance: 150.00, lastUpdated: '1 week ago' },
];

// Budgets now loaded from storage via hook

const debts = [
  {
    id: '1',
    name: 'Credit Card',
    type: 'credit_card' as const,
    balance: 3250.75,
    originalAmount: 5000,
    interestRate: 18.99,
    minimumPayment: 125,
    nextPaymentDate: 'Dec 15, 2024'
  },
  {
    id: '2',
    name: 'Student Loan',
    type: 'student_loan' as const,
    balance: 12450.50,
    originalAmount: 25000,
    interestRate: 4.5,
    minimumPayment: 280,
    nextPaymentDate: 'Dec 20, 2024'
  }
];

const spendingData = [
  { category: 'Food & Dining', amount: 645, color: '#10B981' },
  { category: 'Transportation', amount: 320, color: '#6366F1' },
  { category: 'Entertainment', amount: 380, color: '#F59E0B' },
  { category: 'Shopping', amount: 290, color: '#EF4444' },
  { category: 'Bills & Utilities', amount: 480, color: '#8B5CF6' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddSavingsGoalOpen, setIsAddSavingsGoalOpen] = useState(false);
  const [isAddRecurringTransactionOpen, setIsAddRecurringTransactionOpen] = useState(false);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const { data: budgets = [] } = useBudgets();
  const { data: savingsGoals = [] } = useGoals();
  const upsertGoal = useUpsertGoal();
  const { data: recurring = [] } = useRecurring();
  const upsertRecurring = useUpsertRecurring();
  const delRecurring = useDeleteRecurring();
  const toggleRecurring = useToggleRecurring();
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-balance animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(totalBalance - totalDebt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${totalBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalDebt.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-elevated animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <Target className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalBudgetSpent / totalBudgetAllocated) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Accounts</h2>
          <div className="space-y-4">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="lg:col-span-1 space-y-6">
          <CashflowSummary />
          <SpendingChart data={spendingData} />
        </div>

        {/* Budgets and Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
            <div className="space-y-4">
              {budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          </div>
          <CategoryBreakdown />
        </div>
      </div>

      {/* Debts */}
      {debts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Debt Tracker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {debts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBudgets = () => (
    <BudgetStrategyManager budgets={budgets} />
  );

  const renderDebts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Debt Management</h2>
        <Button className="btn-gradient">Add Debt</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {debts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
      </div>
      <DebtPlanner />
    </div>
  );

  const renderTransactions = () => (
    <TransactionsList />
  );

  const renderSavingsGoals = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Savings Goals</h2>
          <Button className="btn-gradient" onClick={() => setIsAddSavingsGoalOpen(true)}>
            Add Savings Goal
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((goal) => (
            <SavingsGoalCard 
              key={goal.id} 
              goal={goal as any}
              onAddMoney={(goalId, amount) => {
                const g = savingsGoals.find(g => g.id === goalId);
                if (!g) return;
                upsertGoal.mutate({ ...g, current_amount: g.current_amount + amount });
              }}
            />
          ))}
        </div>
        {savingsGoals.length === 0 && (
          <Card className="card-elevated animate-fade-in">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No savings goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Start saving for your dreams! Create your first savings goal.
              </p>
              <Button className="btn-gradient" onClick={() => setIsAddSavingsGoalOpen(true)}>
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderRecurringTransactions = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recurring Transactions</h2>
          <Button className="btn-gradient" onClick={() => setIsAddRecurringTransactionOpen(true)}>
            Add Recurring Transaction
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recurring.map((transaction) => (
            <RecurringTransactionCard 
              key={transaction.id} 
              transaction={transaction as any}
              onToggleActive={(id, active) => toggleRecurring.mutate({ id, active })}
              onEdit={(id) => {
                console.log(`Editing transaction ${id}`);
              }}
              onDelete={(id) => delRecurring.mutate(id)}
            />
          ))}
        </div>
        
        {recurring.length === 0 && (
          <Card className="card-elevated animate-fade-in">
            <CardContent className="text-center py-12">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recurring transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                Automate your finances! Set up recurring income and expenses.
              </p>
              <Button className="btn-gradient" onClick={() => setIsAddRecurringTransactionOpen(true)}>
                Add Your First Recurring Transaction
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile & Settings</h2>
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Profile settings and preferences will be available here.</p>
            <p className="mt-2 text-sm">
              For backend features like authentication, please connect to Supabase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'budgets':
        return renderBudgets();
      case 'savings':
        return renderSavingsGoals();
      case 'recurring':
        return renderRecurringTransactions();
      case 'debts':
        return renderDebts();
      case 'transactions':
        return renderTransactions();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTransaction={() => setIsAddTransactionOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />

      <AddSavingsGoalModal
        isOpen={isAddSavingsGoalOpen}
        onClose={() => setIsAddSavingsGoalOpen(false)}
        onAdd={(goal) => {
          upsertGoal.mutate({ ...goal, is_active: true, current_amount: 0 });
        }}
      />

      <AddRecurringTransactionModal
        isOpen={isAddRecurringTransactionOpen}
        onClose={() => setIsAddRecurringTransactionOpen(false)}
        onAdd={(transaction) => {
          upsertRecurring.mutate({ ...transaction, is_active: true });
        }}
      />
    </div>
  );
};

export default Index;