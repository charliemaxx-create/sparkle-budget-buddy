import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';

export function CashflowSummary() {
  // Fetch first 1000 transactions for a rough summary in mock mode
  const { data } = useTransactions(undefined, 1, 1000);
  const items = data?.items ?? [];

  const totalIncome = items
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = items
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpenses;

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle>Cashflow (All Time)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Income</div>
            <div className="text-2xl font-bold text-success">${totalIncome.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Expenses</div>
            <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Net</div>
            <div className={`text-2xl font-bold ${net >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(net).toLocaleString()} {net >= 0 ? 'surplus' : 'deficit'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




