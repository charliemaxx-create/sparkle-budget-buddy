import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, PiggyBank, TrendingUp, DollarSign, Edit, Check, X } from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  monthlyContribution: number;
  priority: number;
  category: 'emergency' | 'retirement' | 'investment' | 'goal';
  color: string;
  icon: string;
  automaticTransfer: boolean;
}

interface PayYourselfFirstBudgetProps {
  monthlyIncome: number;
  onIncomeChange: (income: number) => void;
}

export const PayYourselfFirstBudget = ({ monthlyIncome, onIncomeChange }: PayYourselfFirstBudgetProps) => {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      target: 15000,
      current: 8500,
      monthlyContribution: 800,
      priority: 1,
      category: 'emergency',
      color: '#10B981',
      icon: '🛡️',
      automaticTransfer: true
    },
    {
      id: '2',
      name: '401(k) Retirement',
      target: 50000,
      current: 25000,
      monthlyContribution: 600,
      priority: 2,
      category: 'retirement',
      color: '#6366F1',
      icon: '🏦',
      automaticTransfer: true
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      target: 30000,
      current: 8200,
      monthlyContribution: 400,
      priority: 3,
      category: 'investment',
      color: '#F59E0B',
      icon: '📈',
      automaticTransfer: false
    },
    {
      id: '4',
      name: 'House Down Payment',
      target: 40000,
      current: 12000,
      monthlyContribution: 500,
      priority: 4,
      category: 'goal',
      color: '#EF4444',
      icon: '🏠',
      automaticTransfer: true
    }
  ]);

  const totalSavingsAllocation = savingsGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const savingsPercentage = monthlyIncome > 0 ? (totalSavingsAllocation / monthlyIncome) * 100 : 0;
  const remainingForExpenses = monthlyIncome - totalSavingsAllocation;

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

  const updateGoalContribution = (goalId: string, newContribution: number) => {
    setSavingsGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, monthlyContribution: Math.max(0, newContribution) }
        : goal
    ));
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'emergency':
        return { label: 'Emergency Fund', description: 'Financial security for unexpected expenses' };
      case 'retirement':
        return { label: 'Retirement', description: 'Long-term financial independence' };
      case 'investment':
        return { label: 'Investment', description: 'Wealth building and growth' };
      case 'goal':
        return { label: 'Financial Goal', description: 'Specific target or purchase' };
      default:
        return { label: 'Savings', description: 'General savings' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Pay Yourself First Strategy
            </span>
            <Badge variant="outline">Wealth Building Focus</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Monthly Income</Label>
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
              Pay yourself first means saving and investing before paying any other expenses. This ensures your financial future is prioritized.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Allocation Summary */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Savings Allocation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                ${totalSavingsAllocation.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {savingsPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Savings Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ${remainingForExpenses.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">For Expenses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info">
                {savingsGoals.filter(g => g.automaticTransfer).length}
              </div>
              <div className="text-sm text-muted-foreground">Auto Transfers</div>
            </div>
          </div>
          
          {savingsPercentage < 10 && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning">
                Consider increasing your savings rate. Financial experts recommend saving at least 10-20% of income.
              </p>
            </div>
          )}
          
          {savingsPercentage >= 20 && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-success">
                Excellent! You're saving {savingsPercentage.toFixed(1)}% of your income. You're on track for financial success.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Savings Goals (Priority Order)</h3>
          <Button className="btn-gradient">
            <Target className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsGoals
            .sort((a, b) => a.priority - b.priority)
            .map((goal, index) => {
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              const monthsToTarget = goal.monthlyContribution > 0 
                ? Math.ceil((goal.target - goal.current) / goal.monthlyContribution)
                : Infinity;
              const categoryInfo = getCategoryInfo(goal.category);

              return (
                <Card key={goal.id} className="card-elevated animate-fade-in">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div 
                            className="text-2xl p-2 rounded-lg"
                            style={{ backgroundColor: `${goal.color}20` }}
                          >
                            {goal.icon}
                          </div>
                          <Badge 
                            className="absolute -top-2 -right-2 text-xs min-w-6 h-6 flex items-center justify-center"
                            style={{ backgroundColor: goal.color }}
                          >
                            {index + 1}
                          </Badge>
                        </div>
                        <div>
                          <CardTitle className="text-base">{goal.name}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {categoryInfo.label}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {goal.automaticTransfer && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${goal.current.toLocaleString()}</span>
                        <span>${goal.target.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Monthly Contribution</Label>
                        <div className="font-semibold text-lg" style={{ color: goal.color }}>
                          ${goal.monthlyContribution.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Time to Goal</Label>
                        <div className="font-semibold text-lg">
                          {monthsToTarget === Infinity ? 'Never' : 
                           monthsToTarget <= 12 ? `${monthsToTarget}mo` : 
                           `${Math.floor(monthsToTarget/12)}y ${monthsToTarget%12}mo`}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {categoryInfo.description}
                    </p>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        style={{ backgroundColor: goal.color }}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Contribute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Strategy Tips */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Pay Yourself First Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Automate everything:</strong> Set up automatic transfers to savings accounts</p>
          <p>• <strong>Start small:</strong> Even 5% is better than 0%. Increase gradually as you adjust</p>
          <p>• <strong>Prioritize by importance:</strong> Emergency fund first, then retirement, then other goals</p>
          <p>• <strong>Treat savings like a bill:</strong> Make it non-negotiable and pay it first</p>
          <p>• <strong>Use separate accounts:</strong> Keep savings goals in different accounts to avoid temptation</p>
        </CardContent>
      </Card>
    </div>
  );
};