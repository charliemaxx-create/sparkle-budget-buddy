import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, ShoppingBag, PiggyBank, DollarSign, Edit, Check, X } from 'lucide-react';

interface BudgetAllocation {
  category: 'needs' | 'wants' | 'savings';
  allocated: number;
  spent: number;
  percentage: number;
  items: string[];
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface FiftyThirtyTwentyBudgetProps {
  monthlyIncome: number;
  onIncomeChange: (income: number) => void;
}

export const FiftyThirtyTwentyBudget = ({ monthlyIncome, onIncomeChange }: FiftyThirtyTwentyBudgetProps) => {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());

  const budgetAllocations: BudgetAllocation[] = [
    {
      category: 'needs',
      allocated: monthlyIncome * 0.5,
      spent: monthlyIncome * 0.35, // Mock data
      percentage: 50,
      items: ['Rent/Mortgage', 'Utilities', 'Groceries', 'Insurance', 'Minimum debt payments'],
      color: '#10B981',
      icon: <Home className="h-5 w-5" />,
      description: 'Essential expenses you cannot avoid'
    },
    {
      category: 'wants',
      allocated: monthlyIncome * 0.3,
      spent: monthlyIncome * 0.25, // Mock data
      percentage: 30,
      items: ['Dining out', 'Entertainment', 'Hobbies', 'Shopping', 'Subscriptions'],
      color: '#6366F1',
      icon: <ShoppingBag className="h-5 w-5" />,
      description: 'Things you enjoy but could live without'
    },
    {
      category: 'savings',
      allocated: monthlyIncome * 0.2,
      spent: monthlyIncome * 0.15, // Mock data
      percentage: 20,
      items: ['Emergency fund', 'Retirement', 'Investments', 'Debt repayment', 'Future goals'],
      color: '#F59E0B',
      icon: <PiggyBank className="h-5 w-5" />,
      description: 'Building your financial future'
    }
  ];

  const handleIncomeSubmit = () => {
    const newIncome = parseFloat(tempIncome);
    if (!isNaN(newIncome) && newIncome >= 0) {
      onIncomeChange(newIncome);
    }
    setIsEditingIncome(false);
  };

  const handleIncomeCancel = () => {
    setTempIncome(monthlyIncome.toString());
    setIsEditingIncome(false);
  };

  const totalSpent = budgetAllocations.reduce((sum, allocation) => sum + allocation.spent, 0);
  const totalAllocated = budgetAllocations.reduce((sum, allocation) => sum + allocation.allocated, 0);

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
        {budgetAllocations.map((allocation) => {
          const usedPercentage = allocation.allocated > 0 
            ? (allocation.spent / allocation.allocated) * 100 
            : 0;
          const isOverBudget = allocation.spent > allocation.allocated;

          return (
            <Card key={allocation.category} className="card-elevated animate-fade-in">
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
                      <p className="text-sm text-muted-foreground">
                        {allocation.percentage}% of income
                      </p>
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
                      (allocation.allocated - allocation.spent) >= 0 
                        ? 'text-success font-medium' 
                        : 'text-destructive font-medium'
                    }>
                      ${Math.abs(allocation.allocated - allocation.spent).toLocaleString()}
                      {(allocation.allocated - allocation.spent) < 0 ? ' over' : ' left'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-semibold text-sm mb-2">Typical {allocation.category}:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {allocation.items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

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