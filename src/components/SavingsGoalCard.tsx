import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Target, Plus } from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  category?: string;
  icon: string;
  color: string;
  is_active: boolean;
}

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onAddMoney?: (goalId: string, amount: number) => void;
}

export const SavingsGoalCard = ({ goal, onAddMoney }: SavingsGoalCardProps) => {
  const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  const remaining = goal.target_amount - goal.current_amount;
  const isCompleted = goal.current_amount >= goal.target_amount;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return null;
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(goal.target_date);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <span className="text-lg mr-2">{goal.icon}</span>
          <div>
            <div className="font-semibold">{goal.name}</div>
            {goal.description && (
              <div className="text-xs text-muted-foreground font-normal">
                {goal.description}
              </div>
            )}
          </div>
        </CardTitle>
        <Badge variant={isCompleted ? 'default' : 'secondary'} className="bg-success text-success-foreground">
          {percentage.toFixed(0)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress 
            value={percentage} 
            className="w-full"
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${goal.current_amount.toLocaleString()} saved
            </span>
            <span className={remaining > 0 ? 'text-muted-foreground' : 'text-success'}>
              {remaining > 0 
                ? `$${remaining.toLocaleString()} to go`
                : 'Goal reached! 🎉'
              }
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <div className="text-muted-foreground">
              Target: ${goal.target_amount.toLocaleString()}
            </div>
            {goal.target_date && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(goal.target_date)}</span>
                {daysRemaining !== null && daysRemaining >= 0 && (
                  <span className="ml-1">
                    ({daysRemaining} days)
                  </span>
                )}
              </div>
            )}
          </div>

          {goal.category && (
            <Badge variant="outline" className="text-xs">
              {goal.category}
            </Badge>
          )}

          {!isCompleted && onAddMoney && (
            <Button 
              size="sm" 
              className="w-full btn-gradient"
              onClick={() => {
                const amount = prompt('How much would you like to add?');
                if (amount && !isNaN(Number(amount))) {
                  onAddMoney(goal.id, Number(amount));
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Money
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};