import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Banknote } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  balance: number;
  lastUpdated: string;
}

interface AccountCardProps {
  account: Account;
}

const getAccountIcon = (type: Account['type']) => {
  switch (type) {
    case 'checking':
    case 'savings':
      return Wallet;
    case 'credit':
      return CreditCard;
    case 'cash':
      return Banknote;
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
    case 'credit':
      return 'bg-warning text-warning-foreground';
    case 'cash':
      return 'bg-secondary text-secondary-foreground';
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
          {account.type}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={isNegative ? 'text-destructive' : 'text-success'}>
            ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated {account.lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
};