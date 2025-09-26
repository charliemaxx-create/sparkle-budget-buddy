import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Play, Pause, Edit, Trash2 } from 'lucide-react';

interface RecurringTransaction {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_execution_date: string;
  last_executed_date?: string;
  is_active: boolean;
  account_id?: string;
  tags?: string[];
}

interface RecurringTransactionCardProps {
  transaction: RecurringTransaction;
  onToggleActive?: (id: string, active: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly', 
  'bi-weekly': 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly'
};

export const RecurringTransactionCard = ({ 
  transaction, 
  onToggleActive, 
  onEdit, 
  onDelete 
}: RecurringTransactionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilNext = (dateString: string) => {
    const nextDate = new Date(dateString);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilNext = getDaysUntilNext(transaction.next_execution_date);
  const isOverdue = daysUntilNext < 0;

  return (
    <Card className={`card-elevated animate-fade-in ${!transaction.is_active ? 'opacity-60' : ''}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <div>
              <div className="font-semibold">{transaction.name}</div>
              {transaction.description && (
                <div className="text-xs text-muted-foreground font-normal">
                  {transaction.description}
                </div>
              )}
            </div>
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={transaction.type === 'income' ? 'default' : 'secondary'}
            className={transaction.type === 'income' ? 'bg-success text-success-foreground' : ''}
          >
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </Badge>
          {!transaction.is_active && (
            <Badge variant="outline" className="text-xs">
              Paused
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frequency:</span>
            <Badge variant="outline">
              {frequencyLabels[transaction.frequency]}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">{transaction.category}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Due:</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                {formatDate(transaction.next_execution_date)}
              </span>
              {isOverdue ? (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Overdue
                </Badge>
              ) : daysUntilNext <= 7 ? (
                <Badge variant="outline" className="ml-2 text-xs text-warning">
                  {daysUntilNext === 0 ? 'Today' : `${daysUntilNext} days`}
                </Badge>
              ) : null}
            </div>
          </div>

          {transaction.last_executed_date && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Executed:</span>
              <span>{formatDate(transaction.last_executed_date)}</span>
            </div>
          )}

          {transaction.tags && transaction.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {transaction.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onToggleActive && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onToggleActive(transaction.id, !transaction.is_active)}
                className="flex-1"
              >
                {transaction.is_active ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </>
                )}
              </Button>
            )}
            {onEdit && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(transaction.id)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};