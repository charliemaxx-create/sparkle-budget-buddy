import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Zap, Calendar, DollarSign, Edit, Check, X, Plus, Layers } from 'lucide-react';

interface ExpenseBucket {
  id: string;
  name: string;
  type: 'fixed' | 'flexible' | 'non-monthly';
  allocated: number;
  spent: number;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  nextDue?: string;
  isEssential: boolean;
  category: string;
}

interface ExpenseBucketsBudgetProps {
  monthlyIncome: number;
  onIncomeChange: (income: number) => void;
}

export const ExpenseBucketsBudget = ({ monthlyIncome, onIncomeChange }: ExpenseBucketsBudgetProps) => {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [expenses, setExpenses] = useState<ExpenseBucket[]>([
    // Fixed Expenses
    {
      id: '1',
      name: 'Rent/Mortgage',
      type: 'fixed',
      allocated: 1200,
      spent: 1200,
      isEssential: true,
      category: 'Housing'
    },
    {
      id: '2',
      name: 'Car Payment',
      type: 'fixed',
      allocated: 350,
      spent: 350,
      isEssential: false,
      category: 'Transportation'
    },
    {
      id: '3',
      name: 'Insurance (Health)',
      type: 'fixed',
      allocated: 200,
      spent: 200,
      isEssential: true,
      category: 'Insurance'
    },
    // Flexible Expenses
    {
      id: '4',
      name: 'Groceries',
      type: 'flexible',
      allocated: 500,
      spent: 380,
      isEssential: true,
      category: 'Food'
    },
    {
      id: '5',
      name: 'Gas & Transportation',
      type: 'flexible',
      allocated: 200,
      spent: 150,
      isEssential: true,
      category: 'Transportation'
    },
    {
      id: '6',
      name: 'Entertainment',
      type: 'flexible',
      allocated: 300,
      spent: 280,
      isEssential: false,
      category: 'Entertainment'
    },
    // Non-Monthly Expenses
    {
      id: '7',
      name: 'Car Registration',
      type: 'non-monthly',
      allocated: 25, // Monthly savings for yearly expense
      spent: 0,
      frequency: 'yearly',
      nextDue: '2024-08-15',
      isEssential: true,
      category: 'Transportation'
    },
    {
      id: '8',
      name: 'Holiday Gifts',
      type: 'non-monthly',
      allocated: 100, // Monthly savings
      spent: 50,
      frequency: 'yearly',
      nextDue: '2024-12-01',
      isEssential: false,
      category: 'Gifts'
    },
    {
      id: '9',
      name: 'Home Maintenance',
      type: 'non-monthly',
      allocated: 150, // Monthly savings for repairs
      spent: 75,
      frequency: 'quarterly',
      nextDue: '2024-03-01',
      isEssential: true,
      category: 'Housing'
    }
  ]);

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

  const getBucketTotals = (type: 'fixed' | 'flexible' | 'non-monthly') => {
    const bucketExpenses = expenses.filter(e => e.type === type);
    const allocated = bucketExpenses.reduce((sum, e) => sum + e.allocated, 0);
    const spent = bucketExpenses.reduce((sum, e) => sum + e.spent, 0);
    return { allocated, spent, count: bucketExpenses.length };
  };

  const fixedTotals = getBucketTotals('fixed');
  const flexibleTotals = getBucketTotals('flexible');
  const nonMonthlyTotals = getBucketTotals('non-monthly');

  const totalAllocated = fixedTotals.allocated + flexibleTotals.allocated + nonMonthlyTotals.allocated;
  const totalSpent = fixedTotals.spent + flexibleTotals.spent + nonMonthlyTotals.spent;
  const remaining = monthlyIncome - totalAllocated;

  const getBucketIcon = (type: 'fixed' | 'flexible' | 'non-monthly') => {
    switch (type) {
      case 'fixed':
        return <Home className="h-5 w-5" />;
      case 'flexible':
        return <Zap className="h-5 w-5" />;
      case 'non-monthly':
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getBucketColor = (type: 'fixed' | 'flexible' | 'non-monthly') => {
    switch (type) {
      case 'fixed':
        return '#EF4444';
      case 'flexible':
        return '#10B981';
      case 'non-monthly':
        return '#6366F1';
    }
  };

  const renderBucketExpenses = (type: 'fixed' | 'flexible' | 'non-monthly') => {
    const bucketExpenses = expenses.filter(e => e.type === type);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bucketExpenses.map((expense) => {
          const percentage = expense.allocated > 0 ? (expense.spent / expense.allocated) * 100 : 0;
          const isOverBudget = expense.spent > expense.allocated;
          
          return (
            <Card key={expense.id} className="card-elevated">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-sm font-medium">
                      {expense.name}
                    </CardTitle>
                    {expense.isEssential && (
                      <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                        Essential
                      </Badge>
                    )}
                  </div>
                  <Badge 
                    variant={isOverBudget ? 'destructive' : 'secondary'}
                    className={!isOverBudget ? 'bg-success text-success-foreground' : ''}
                  >
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {expense.category}
                  {expense.frequency && ` • ${expense.frequency}`}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {type !== 'fixed' && (
                  <Progress value={Math.min(percentage, 100)} className="w-full" />
                )}
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {type === 'non-monthly' ? 'Monthly savings:' : 'Budgeted:'}
                    </span>
                    <span className="font-medium">${expense.allocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spent:</span>
                    <span className={isOverBudget ? 'text-destructive font-medium' : 'font-medium'}>
                      ${expense.spent.toLocaleString()}
                    </span>
                  </div>
                  {type !== 'fixed' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className={
                        (expense.allocated - expense.spent) >= 0 
                          ? 'text-success font-medium' 
                          : 'text-destructive font-medium'
                      }>
                        ${Math.abs(expense.allocated - expense.spent).toLocaleString()}
                        {(expense.allocated - expense.spent) < 0 ? ' over' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {expense.nextDue && (
                  <div className="text-xs text-muted-foreground">
                    Next due: {new Date(expense.nextDue).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {type !== 'fixed' && (
                    <Button size="sm" className="flex-1" style={{ backgroundColor: getBucketColor(type) }}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      Record
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        <Card className="card-elevated border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <Button variant="outline" className="flex-col h-auto py-4">
              <Plus className="h-6 w-6 mb-2" />
              <span>Add {type.charAt(0).toUpperCase() + type.slice(1)} Expense</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Expense Buckets Strategy
            </span>
            <Badge variant="outline">Detailed Control</Badge>
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
              Organize expenses into three buckets: Fixed (unchanging), Flexible (variable), and Non-Monthly (irregular).
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2" style={{ color: getBucketColor('fixed') }}>
              {getBucketIcon('fixed')}
            </div>
            <div className="text-lg font-bold">${fixedTotals.allocated.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Fixed Expenses</div>
            <div className="text-xs text-muted-foreground">{fixedTotals.count} items</div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2" style={{ color: getBucketColor('flexible') }}>
              {getBucketIcon('flexible')}
            </div>
            <div className="text-lg font-bold">${flexibleTotals.allocated.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Flexible Expenses</div>
            <div className="text-xs text-muted-foreground">{flexibleTotals.count} items</div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2" style={{ color: getBucketColor('non-monthly') }}>
              {getBucketIcon('non-monthly')}
            </div>
            <div className="text-lg font-bold">${nonMonthlyTotals.allocated.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Non-Monthly Fund</div>
            <div className="text-xs text-muted-foreground">{nonMonthlyTotals.count} items</div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className={`h-5 w-5 ${remaining >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div className={`text-lg font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {remaining >= 0 ? 'Unallocated' : 'Over Budget'}
            </div>
            <div className="text-xs text-muted-foreground">
              {((remaining / monthlyIncome) * 100).toFixed(1)}% of income
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Buckets */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Expense Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fixed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fixed" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Fixed</span>
              </TabsTrigger>
              <TabsTrigger value="flexible" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Flexible</span>
              </TabsTrigger>
              <TabsTrigger value="non-monthly" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Non-Monthly</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fixed" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <strong>Fixed Expenses:</strong> These expenses stay the same each month (rent, insurance, loan payments).
              </div>
              {renderBucketExpenses('fixed')}
            </TabsContent>
            
            <TabsContent value="flexible" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <strong>Flexible Expenses:</strong> These expenses vary month to month and you have control over the amount.
              </div>
              {renderBucketExpenses('flexible')}
            </TabsContent>
            
            <TabsContent value="non-monthly" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <strong>Non-Monthly Expenses:</strong> Save monthly for expenses that don't occur every month (car registration, gifts, home repairs).
              </div>
              {renderBucketExpenses('non-monthly')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Strategy Tips */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Expense Buckets Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Fixed expenses:</strong> Focus on reducing these for the biggest impact on your budget</p>
          <p>• <strong>Flexible expenses:</strong> Where you have the most control - track and adjust regularly</p>
          <p>• <strong>Non-monthly fund:</strong> Prevent budget surprises by saving for irregular expenses</p>
          <p>• <strong>Priority order:</strong> Cover essentials first, then work on wants and savings</p>
        </CardContent>
      </Card>
    </div>
  );
};