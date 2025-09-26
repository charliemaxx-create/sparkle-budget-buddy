import { useState, useMemo } from 'react';
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
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { BudgetStrategyManager } from '@/components/budgeting/BudgetStrategyManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target, Plus, PieChart } from 'lucide-react';
import { useDebts, useUpsertDebt, useDeleteDebt } from '@/hooks/useDebts';
import { AddDebtModal } from '@/components/debts/AddDebtModal';
import { AddAccountModal } from '@/components/AddAccountModal';
import { useAccounts, useUpsertAccount } from '@/hooks/useAccounts';
import type { DebtItem } from '@/services/debts';
import type { Account } from '@/types';
import { AccountsPage } from './AccountsPage';
import { ProfilePreferences } from '@/components/ProfilePreferences';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions } from '@/hooks/useTransactions';
import { Progress } from '@/components/ui/progress';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddSavingsGoalOpen, setIsAddSavingsGoalOpen] = useState(false);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtItem | null>(null);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const { data: accounts = [] } = useAccounts();
  const upsertAccount = useUpsertAccount();

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  const { data: budgets = [] } = useBudgets();
  const { data: savingsGoals = [] } = useGoals();
  const upsertGoal = useUpsertGoal();
  const { data: debts = [] } = useDebts();
  const upsertDebt = useUpsertDebt();
  const deleteDebt = useDeleteDebt();

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalBudgetRemaining = totalBudgetAllocated - totalBudgetSpent;
  const totalBudgetPercentage = totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated) * 100 : 0;
  const isTotalBudgetOver = totalBudgetSpent > totalBudgetAllocated;

  const { data: allCategories = [] } = useCategories();
  const { data: allTransactionsData } = useTransactions(undefined, 1, 1000);
  const allTransactions = allTransactionsData?.items ?? [];

  // Memoize spending data for top-tier categories
  const spendingData = useMemo(() => {
    const topLevelCategories = allCategories.filter(cat => cat.parent_id === null);
    const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));
    const spendingByTopCategory = new Map<string, { amount: number; color: string; name: string }>();

    topLevelCategories.forEach(cat => {
      spendingByTopCategory.set(cat.id, { amount: 0, color: cat.color || '#6366F1', name: cat.name });
    });

    allTransactions.forEach(tx => {
      if (tx.type === 'expense' && tx.categoryId) {
        let currentCategory = categoryMap.get(tx.categoryId);
        let topLevelParentId = tx.categoryId;

        // Traverse up to find the top-level parent
        while (currentCategory && currentCategory.parent_id) {
          topLevelParentId = currentCategory.parent_id;
          currentCategory = categoryMap.get(currentCategory.parent_id);
        }

        if (spendingByTopCategory.has(topLevelParentId)) {
          const current = spendingByTopCategory.get(topLevelParentId)!;
          current.amount += tx.amount;
          spendingByTopCategory.set(topLevelParentId, current);
        } else {
          // If a transaction's top-level category isn't explicitly in topLevelCategories (e.g., uncategorized or new)
          // We can add it as an 'Other' or dynamically add it if needed.
          // For simplicity, we can add to an 'Uncategorized' or 'Other' bucket
          const otherId = 'other-expenses';
          if (!spendingByTopCategory.has(otherId)) {
            spendingByTopCategory.set(otherId, { amount: 0, color: '#A0A0A0', name: 'Other Expenses' });
          }
          const other = spendingByTopCategory.get(otherId)!;
          other.amount += tx.amount;
          spendingByTopCategory.set(otherId, other);
        }
      }
    });

    return Array.from(spendingByTopCategory.values()).filter(item => item.amount > 0);
  }, [allCategories, allTransactions]);


  const handleEditDebt = (id: string) => {
    const debtToEdit = debts.find(d => d.id === id);
    if (debtToEdit) {
      setEditingDebt(debtToEdit);
      setIsAddDebtOpen(true);
    }
  };

  const handleDeleteDebt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      deleteDebt.mutate(id);
    }
  };

  const handleCloseDebtModal = () => {
    setIsAddDebtOpen(false);
    setEditingDebt(null);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsAddAccountOpen(true);
  };

  const handleSaveAccount = (account: Omit<Account, 'id' | 'lastUpdatedIso'> & { id?: string }) => {
    upsertAccount.mutate({ ...account, lastUpdatedIso: new Date().toISOString() });
  };

  const handleCloseAccountModal = () => {
    setIsAddAccountOpen(false);
    setEditingAccount(null);
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="lg:col-span-1 space-y-6">
          <CashflowSummary />
          <SpendingChart data={spendingData} />
        </div>

        {/* Budgets and Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
            <Card className="card-elevated animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  Overall Budget
                </CardTitle>
                <Badge variant={isTotalBudgetOver ? 'destructive' : 'secondary'}>
                  {totalBudgetPercentage.toFixed(0)}% Used
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={Math.min(totalBudgetPercentage, 100)} className="w-full" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${totalBudgetSpent.toLocaleString()} spent
                    </span>
                    <span className={totalBudgetRemaining >= 0 ? 'text-success' : 'text-destructive'}>
                      ${Math.abs(totalBudgetRemaining).toLocaleString()} {totalBudgetRemaining >= 0 ? 'left' : 'over'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Total Allocated: ${totalBudgetAllocated.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <CategoryBreakdown />
        </div>
      </div>
    </div>
  );

  const renderBudgets = () => (
    <BudgetStrategyManager budgets={budgets} />
  );

  const renderDebts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Debt Management</h2>
        <Button className="btn-gradient" onClick={() => setIsAddDebtOpen(true)}>Add Debt</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {debts.map((debt) => (
          <DebtCard 
            key={debt.id} 
            debt={debt} 
            onEdit={handleEditDebt}
            onDelete={handleDeleteDebt}
          />
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

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile & Settings</h2>
      <ProfilePreferences />
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Additional account settings will be available here.</p>
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
      case 'accounts':
        return <AccountsPage />;
      case 'budgets':
        return renderBudgets();
      case 'savings':
        return renderSavingsGoals();
      case 'transactions':
        return renderTransactions();
      case 'debts':
        return renderDebts();
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

      <AddDebtModal
        isOpen={isAddDebtOpen}
        onClose={handleCloseDebtModal}
        onAdd={(debt) => {
          upsertDebt.mutate({ ...debt, id: editingDebt?.id });
        }}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={handleCloseAccountModal}
        onSave={handleSaveAccount}
        initialData={editingAccount}
      />
    </div>
  );
};

export default Index;