import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Banknote, Landmark, PiggyBank, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/currency'; // Import formatCurrency

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan' | 'liability';
  balance: number;
  currency: string; // Added currency
  lastUpdated: string;
}

interface AccountCardProps {
  account: Account;
}

const getAccountIcon = (type: Account['type']) => {
  switch (type) {
    case 'checking':
      return Landmark;
    case 'savings':
      return PiggyBank;
    case 'credit_card':
      return CreditCard;
    case 'cash':
      return Banknote;
    case 'investment':
      return TrendingUp;
    case 'loan':
    case 'liability':
      return TrendingDown;
    default:
      return Wallet;
  }
};

const getAccountColor = (type: Account['type']) => {
  switch (type) {
    case 'checking':
      return 'bg-info text-info-foreground';
    case 'savings':
      return 'bg-success text-success-foreground';
    case 'credit_card':
      return 'bg-warning text-warning-foreground';
    case 'cash':
      return 'bg-secondary text-secondary-foreground';
    case 'investment':
      return 'bg-primary text-primary-foreground';
    case 'loan':
    case 'liability':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const AccountCard = ({ account }: AccountCardProps) => {
  const Icon = getAccountIcon(account.type);
  const isNegative = account.balance < 0;

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
        <Badge className={getAccountColor(account.type)}>
          <Icon className="h-3 w-3 mr-1" />
          {account.type.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={isNegative ? 'text-destructive' : 'text-success'}>
            {formatCurrency(Math.abs(account.balance), account.currency)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated {account.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
};