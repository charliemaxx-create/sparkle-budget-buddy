import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Car, GraduationCap } from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  type: 'credit_card' | 'mortgage' | 'auto_loan' | 'student_loan' | 'personal_loan';
  balance: number;
  originalAmount: number;
  interestRate: number;
  minimumPayment: number;
  nextPaymentDate: string;
}

interface DebtCardProps {
  debt: Debt;
}

const getDebtIcon = (type: Debt['type']) => {
  switch (type) {
    case 'credit_card':
      return CreditCard;
    case 'mortgage':
      return Building2;
    case 'auto_loan':
      return Car;
    case 'student_loan':
      return GraduationCap;
    default:
      return CreditCard;
  }
};

const getDebtColor = (type: Debt['type']) => {
  switch (type) {
    case 'credit_card':
      return 'bg-destructive text-destructive-foreground';
    case 'mortgage':
      return 'bg-info text-info-foreground';
    case 'auto_loan':
      return 'bg-warning text-warning-foreground';
    case 'student_loan':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const DebtCard = ({ debt }: DebtCardProps) => {
  const Icon = getDebtIcon(debt.type);
  const paidOffPercentage = ((debt.originalAmount - debt.balance) / debt.originalAmount) * 100;

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{debt.name}</CardTitle>
        <Badge className={getDebtColor(debt.type)}>
          <Icon className="h-3 w-3 mr-1" />
          {debt.type.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-2xl font-bold text-destructive">
            ${debt.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          
          <Progress value={paidOffPercentage} className="w-full" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{paidOffPercentage.toFixed(1)}% paid off</span>
            <span>${debt.interestRate}% APR</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Min Payment:</span>
            <span className="font-medium">${debt.minimumPayment}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Next payment: {debt.nextPaymentDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};