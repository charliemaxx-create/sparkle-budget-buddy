import { useState } from 'react';
import { BudgetStrategySelector } from './BudgetStrategySelector';
import { FiftyThirtyTwentyBudget } from './FiftyThirtyTwentyBudget';
import { EnvelopeBudget } from './EnvelopeBudget';
import { PayYourselfFirstBudget } from './PayYourselfFirstBudget';
import { ExpenseBucketsBudget } from './ExpenseBucketsBudget';
import { BudgetCard } from '../BudgetCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { AddBudgetCategoryModal } from '../AddBudgetCategoryModal'; // Import the new modal
import { useUpsertBudget, useDeleteBudget } from '@/hooks/useBudgets'; // Import hooks for budget actions
import type { BudgetItem } from '@/services/budgets';

type BudgetStrategyType = '50-30-20' | 'envelope' | 'pay-yourself-first' | 'expense-buckets' | 'traditional' | null;

interface BudgetStrategyManagerProps {
  // Mock data for traditional budgeting - to maintain existing functionality
  budgets?: Array<{
    id: string;
    category: string;
    allocated: number;
    spent: number;
    icon: string;
    color: string;
  }>;
}

export const BudgetStrategyManager = ({ budgets = [] }: BudgetStrategyManagerProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState<BudgetStrategyType>('traditional');
  const [monthlyIncome, setMonthlyIncome] = useState(5000); // Default income
  const [showSelector, setShowSelector] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);

  const upsertBudget = useUpsertBudget();
  const deleteBudget = useDeleteBudget();

  const handleStrategyChange = (strategyType: string) => {
    setSelectedStrategy(strategyType as BudgetStrategyType);
    setShowSelector(false);
  };

  const handleSaveBudget = (budget: Omit<BudgetItem, 'spent'> & { id?: string }) => {
    upsertBudget.mutate({ ...budget, spent: budget.id ? (budgets.find(b => b.id === budget.id)?.spent || 0) : 0 });
    setEditingBudget(null);
    setIsAddBudgetModalOpen(false);
  };

  const handleEditBudget = (id: string) => {
    const budgetToEdit = budgets.find(b => b.id === id);
    if (budgetToEdit) {
      setEditingBudget(budgetToEdit);
      setIsAddBudgetModalOpen(true);
    }
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget category?')) {
      deleteBudget.mutate(id);
    }
  };

  const getStrategyInfo = (strategy: BudgetStrategyType) => {
    switch (strategy) {
      case '50-30-20':
        return { name: '50-30-20 Rule', description: 'Simple percentage-based budgeting' };
      case 'envelope':
        return { name: 'Envelope Method', description: 'Cash-based spending control' };
      case 'pay-yourself-first':
        return { name: 'Pay Yourself First', description: 'Savings-focused strategy' };
      case 'expense-buckets':
        return { name: 'Expense Buckets', description: 'Detailed expense categorization' };
      case 'traditional':
        return { name: 'Traditional Budgeting', description: 'Classic category-based approach' };
      default:
        return { name: 'Select Strategy', description: 'Choose your budgeting approach' };
    }
  };

  const strategyInfo = getStrategyInfo(selectedStrategy);

  // Show strategy selector if no strategy is selected or if explicitly requested
  if (!selectedStrategy || showSelector) {
    return (
      <div className="space-y-6">
        <BudgetStrategySelector 
          selectedStrategy={selectedStrategy || undefined}
          onSelectStrategy={handleStrategyChange}
        />
      </div>
    );
  }

  // Render the selected strategy
  const renderStrategy = () => {
    switch (selectedStrategy) {
      case '50-30-20':
        return (
          <FiftyThirtyTwentyBudget 
            monthlyIncome={monthlyIncome}
            onIncomeChange={setMonthlyIncome}
          />
        );
      case 'envelope':
        return <EnvelopeBudget monthlyIncome={monthlyIncome} />;
      case 'pay-yourself-first':
        return (
          <PayYourselfFirstBudget 
            monthlyIncome={monthlyIncome}
            onIncomeChange={setMonthlyIncome}
          />
        );
      case 'expense-buckets':
        return (
          <ExpenseBucketsBudget 
            monthlyIncome={monthlyIncome}
            onIncomeChange={setMonthlyIncome}
          />
        );
      case 'traditional':
        return (
          <div className="space-y-6">
            {/* Header for Traditional Budgeting */}
            <Card className="card-elevated animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Traditional Category Budgeting
                  </span>
                  <Badge variant="outline">Comprehensive Control</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track every expense category with detailed control over your spending. 
                  Perfect for those who want complete visibility into their finances.
                </p>
              </CardContent>
            </Card>

            {/* Traditional Budget Cards */}
            <div className="flex justify-end mb-4">
              <Button className="btn-gradient" onClick={() => {
                setEditingBudget(null);
                setIsAddBudgetModalOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget Category
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => (
                <Card key={budget.id} className="card-elevated animate-fade-in">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <span className="text-lg mr-2">{budget.icon}</span>
                      {budget.category}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditBudget(budget.id)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteBudget(budget.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BudgetCard budget={budget} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {budgets.length === 0 && (
              <Card className="card-elevated animate-fade-in">
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No budget categories yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first budget category to start tracking your expenses.
                  </p>
                  <Button className="btn-gradient" onClick={() => {
                    setEditingBudget(null);
                    setIsAddBudgetModalOpen(true);
                  }}>
                    Add Budget Category
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategy Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSelector(true)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Change Strategy
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{strategyInfo.name}</h2>
            <p className="text-muted-foreground">{strategyInfo.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Strategy Content */}
      {renderStrategy()}

      <AddBudgetCategoryModal
        isOpen={isAddBudgetModalOpen}
        onClose={() => setIsAddBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        initialData={editingBudget}
      />
    </div>
  );
};