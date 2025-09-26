import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, convertCurrency } from '@/utils/currency'; // Import currency utilities
import { useAccounts } from '@/hooks/useAccounts'; // To get account currency

export function CashflowSummary() {
  const { data: accountsData } = useAccounts();
  const accounts = accountsData ?? [];
  const { data } = useTransactions(undefined, 1, 1000);
  const items = data?.items ?? [];

  const baseCurrency = 'USD'; // Define a base currency for aggregation

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of items) {
    const account = accounts.find(a => a.id === t.accountId);
    const transactionCurrency = t.currency || account?.currency || baseCurrency;
    const convertedAmount = convertCurrency(t.amount, transactionCurrency, baseCurrency);

    if (t.type === 'income') {
      totalIncome += convertedAmount;
    } else if (t.type === 'expense') {
      totalExpenses += convertedAmount;
    }
  }
  
  const net = totalIncome - totalExpenses;

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle>Cashflow (All Time)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Aggregated in {baseCurrency}. Exchange rates are mock.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Income</div>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalIncome, baseCurrency)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Expenses</div>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses, baseCurrency)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Net</div>
            <div className={`text-2xl font-bold ${net >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(Math.abs(net), baseCurrency)} {net >= 0 ? 'surplus' : 'deficit'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}