import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency'; // Import formatCurrency

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  currency: string; // Added currency
}

interface BudgetCardProps {
  budget: Budget;
}

export const BudgetCard = ({ budget }: BudgetCardProps) => {
  const percentage = (budget.spent / budget.allocated) * 100;
  const remaining = budget.allocated - budget.spent;
  const isOverBudget = budget.spent > budget.allocated;

  const getProgressColor = () => {
    if (isOverBudget) return 'progress-danger';
    if (percentage > 80) return 'progress-warning';
    return 'progress-success';
  };

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <span className="text-lg mr-2">{budget.icon}</span>
          {budget.category}
        </CardTitle>
        <Badge variant={isOverBudget ? 'destructive' : 'secondary'}>
          {percentage.toFixed(0)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={Math.min(percentage, 100)} className="w-full" />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(budget.spent, budget.currency)} spent
            </span>
            <span className={remaining >= 0 ? 'text-success' : 'text-destructive'}>
              {formatCurrency(Math.abs(remaining), budget.currency)} {remaining >= 0 ? 'left' : 'over'}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Budget: {formatCurrency(budget.allocated, budget.currency)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};