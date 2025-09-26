import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Banknote, Landmark, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react'; // Added TrendingUp

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan' | 'liability'; // Updated types
  balance: number;
  lastUpdated: string;
}

interface AccountCardProps {
  account: Account;
}

const getAccountIcon = (type: Account['type']) => {
  switch (type) {
    case 'checking':
      return Landmark; // Bank icon for checking
    case 'savings':
      return PiggyBank; // Piggy bank for savings
    case 'credit_card': // Updated type
      return CreditCard;
    case 'cash':
      return Banknote;
    case 'investment':
      return TrendingUp; // Trending up for investment
    case 'loan':
    case 'liability': // New type
      return TrendingDown; // Trending down for liabilities/loans
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
    case 'credit_card': // Updated type
      return 'bg-warning text-warning-foreground';
    case 'cash':
      return 'bg-secondary text-secondary-foreground';
    case 'investment':
      return 'bg-primary text-primary-foreground';
    case 'loan':
    case 'liability': // New type
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