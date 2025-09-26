import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, ShoppingBag, PiggyBank, DollarSign, Edit, Check, X } from 'lucide-react';
import { useActiveBudgetStrategy, useUpsertBudgetStrategy } from '@/hooks/useBudgetStrategies';
import { useBudgetAllocations, useUpsertBudgetAllocation } from '@/hooks/useBudgetAllocations';
import type { Tables } from '@/integrations/supabase/types';

interface FiftyThirtyTwentyBudgetProps {
  monthlyIncome: number; // This will be managed internally now
  onIncomeChange: (income: number) => void; // This will be used to update the parent state if needed
}

const STRATEGY_TYPE = '50-30-20';

export const FiftyThirtyTwentyBudget = ({ onIncomeChange }: FiftyThirtyTwentyBudgetProps) => {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState('');
  const [editingPercentages, setEditingPercentages] = useState<Record<string, number>>({});

  const { data: activeStrategy, isLoading: isLoadingStrategy } = useActiveBudgetStrategy(STRATEGY_TYPE);
  const upsertStrategy = useUpsertBudgetStrategy();
  const { data: allocations = [], isLoading: isLoadingAllocations } = useBudgetAllocations(activeStrategy?.id || '');
  const upsertAllocation = useUpsertBudgetAllocation();

  const monthlyIncome = activeStrategy?.monthly_income ?? 0;

  useEffect(() => {
    if (activeStrategy) {
      setTempIncome(activeStrategy.monthly_income?.toString() ?? '0');
    }
  }, [activeStrategy]);

  useEffect(() => {
    if (activeStrategy && !isLoadingAllocations && allocations.length === 0) {
      // Create default allocations if none exist for this strategy
      const defaultAllocations = [
        { category_name: 'Needs', percentage_of_income: 0.50, allocated_amount: monthlyIncome * 0.50, spent_amount: 0, remaining_amount: monthlyIncome * 0.50, category_type: STRATEGY_TYPE, strategy_id: activeStrategy.id },
        { category_name: 'Wants', percentage_of_income: 0.30, allocated_amount: monthlyIncome * 0.30, spent_amount: 0, remaining_amount: monthlyIncome * 0.30, category_type: STRATEGY_TYPE, strategy_id: activeStrategy.id },
        { category_name: 'Savings', percentage_of_income: 0.20, allocated_amount: monthlyIncome * 0.20, spent_amount: 0, remaining_amount: monthlyIncome * 0.20, category_type: STRATEGY_TYPE, strategy_id: activeStrategy.id },
      ];
      defaultAllocations.forEach(alloc => upsertAllocation.mutate(alloc));
    }
  }, [activeStrategy, isLoadingAllocations, allocations, monthlyIncome, upsertAllocation]);

  const handleIncomeSubmit = () => {
    const newIncome = parseFloat(tempIncome);
    if (!isNaN(newIncome) && newIncome >= 0) {
      upsertStrategy.mutate({
        id: activeStrategy?.id,
        name: `${STRATEGY_TYPE} Budget`,
        strategy_type: STRATEGY_TYPE,
        is_active: true,
        monthly_income: newIncome,
      }, {
        onSuccess: (data) => {
          onIncomeChange(newIncome); // Notify parent of income change
          // Update allocations based on new income
          allocations.forEach(alloc => {
            if (alloc.percentage_of_income !== null) {
              const newAllocatedAmount = newIncome * alloc.percentage_of_income;
              upsertAllocation.mutate({
                id: alloc.id,
                allocated_amount: newAllocatedAmount,
                remaining_amount: newAllocatedAmount - alloc.spent_amount,
              });
            }
          });
        }
      });
    }
    setIsEditingIncome(false);
  };

  const handleIncomeCancel = () => {
    setTempIncome(monthlyIncome.toString());
    setIsEditingIncome(false);
  };

  const handlePercentageChange = (categoryId: string, newPercentage: number) => {
    setEditingPercentages(prev => ({ ...prev, [categoryId]: newPercentage }));
  };

  const handleSavePercentages = (allocation: Tables<'budget_allocations'>) => {
    const newPercentage = editingPercentages[allocation.id];
    if (newPercentage !== undefined && !isNaN(newPercentage) && newPercentage >= 0) {
      const newAllocatedAmount = monthlyIncome * (newPercentage / 100);
      upsertAllocation.mutate({
        id: allocation.id,
        percentage_of_income: newPercentage / 100,
        allocated_amount: newAllocatedAmount,
        remaining_amount: newAllocatedAmount - allocation.spent_amount,
      }, {
        onSuccess: () => {
          setEditingPercentages(prev => {
            const newState = { ...prev };
            delete newState[allocation.id];
            return newState;
          });
        }
      });
    }
  };

  const handleCancelPercentageEdit = (allocationId: string) => {
    setEditingPercentages(prev => {
      const newState = { ...prev };
      delete newState[allocationId];
      return newState;
    });
  };

  const budgetAllocationsData = allocations.map(alloc => {
    const percentage = (alloc.percentage_of_income ?? 0) * 100;
    const allocated = alloc.allocated_amount ?? 0;
    const spent = alloc.spent_amount ?? 0;
    const remaining = alloc.remaining_amount ?? 0;

    let icon: React.ReactNode;
    let color: string;
    switch (alloc.category_name) {
      case 'Needs':
        icon = <Home className="h-5 w-5" />;
        color = '#10B981';
        break;
      case 'Wants':
        icon = <ShoppingBag className="h-5 w-5" />;
        color = '#6366F1';
        break;
      case 'Savings':
        icon = <PiggyBank className="h-5 w-5" />;
        color = '#F59E0B';
        break;
      default:
        icon = <DollarSign className="h-5 w-5" />;
        color = '#8B5CF6';
    }

    let description = '';
    switch (alloc.category_name) {
      case 'Needs':
        description = 'Essential expenses you cannot avoid';
        break;
      case 'Wants':
        description = 'Things you enjoy but could live without';
        break;
      case 'Savings':
        description = 'Building your financial future';
        break;
    }

    return {
      ...alloc,
      category: alloc.category_name,
      allocated,
      spent,
      remaining,
      percentage,
      icon,
      color,
      description,
      items: [], // Not directly used in this view, but kept for type consistency
    };
  });

  const totalSpent = budgetAllocationsData.reduce((sum, allocation) => sum + allocation.spent, 0);
  const totalAllocated = budgetAllocationsData.reduce((sum, allocation) => sum + allocation.allocated, 0);

  if (isLoadingStrategy || isLoadingAllocations) {
    return <div>Loading 50-30-20 Budget...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Income */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              50-30-20 Budget Strategy
            </span>
            <Badge variant="outline">Simple & Balanced</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Monthly After-Tax Income</Label>
              {!isEditingIncome ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    ${monthlyIncome.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingIncome(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={tempIncome}
                    onChange={(e) => setTempIncome(e.target.value)}
                    className="w-32"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleIncomeSubmit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleIncomeCancel}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              The 50-30-20 rule automatically allocates your income: 50% for needs, 30% for wants, and 20% for savings and debt repayment.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgetAllocationsData.map((allocation) => {
          const usedPercentage = allocation.allocated > 0 
            ? (allocation.spent / allocation.allocated) * 100 
            : 0;
          const isOverBudget = allocation.spent > allocation.allocated;
          const isEditing = editingPercentages[allocation.id] !== undefined;

          return (
            <Card key={allocation.id} className="card-elevated animate-fade-in">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg text-white"
                      style={{ backgroundColor: allocation.color }}
                    >
                      {allocation.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {allocation.category}
                      </CardTitle>
                      {!isEditing ? (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{allocation.percentage.toFixed(0)}% of income</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handlePercentageChange(allocation.id, allocation.percentage)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={editingPercentages[allocation.id]}
                            onChange={(e) => handlePercentageChange(allocation.id, Number(e.target.value))}
                            className="w-20 h-8 text-sm"
                            min="0"
                            max="100"
                            step="1"
                            autoFocus
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                          <Button size="sm" onClick={() => handleSavePercentages(allocation)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancelPercentageEdit(allocation.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={isOverBudget ? 'destructive' : 'secondary'}
                    className={!isOverBudget ? 'bg-success text-success-foreground' : ''}
                  >
                    {usedPercentage.toFixed(0)}%
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {allocation.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Progress 
                  value={Math.min(usedPercentage, 100)} 
                  className="w-full"
                />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated:</span>
                    <span className="font-medium">
                      ${allocation.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent:</span>
                    <span className={isOverBudget ? 'text-destructive font-medium' : 'font-medium'}>
                      ${allocation.spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className={
                      allocation.remaining >= 0 
                        ? 'text-success font-medium' 
                        : 'text-destructive font-medium'
                    }>
                      ${Math.abs(allocation.remaining).toLocaleString()}
                      {allocation.remaining < 0 ? ' over' : ' left'}
                    </span>
                  </div>
                </div>

                {/* <div className="pt-2">
                  <h4 className="font-semibold text-sm mb-2">Typical {allocation.category}:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {allocation.items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div> */}

                <Button className="w-full btn-gradient" size="sm">
                  View Transactions
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Monthly Income</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Allocated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                (monthlyIncome - totalSpent) >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                ${Math.abs(monthlyIncome - totalSpent).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {(monthlyIncome - totalSpent) >= 0 ? 'Remaining' : 'Over Budget'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};