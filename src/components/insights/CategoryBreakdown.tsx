import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, convertCurrency } from '@/utils/currency'; // Import currency utilities
import { useAccounts } from '@/hooks/useAccounts'; // To get account currency

export function CategoryBreakdown() {
  const { data: accountsData } = useAccounts();
  const accounts = accountsData ?? [];
  const { data } = useTransactions(undefined, 1, 1000);
  const items = data?.items ?? [];

  const baseCurrency = 'USD'; // Define a base currency for aggregation

  const totals = new Map<string, number>();
  for (const t of items) {
    if (t.type !== 'expense') continue;
    const account = accounts.find(a => a.id === t.accountId);
    const transactionCurrency = t.currency || account?.currency || baseCurrency;
    const convertedAmount = convertCurrency(t.amount, transactionCurrency, baseCurrency);

    const key = t.categoryId ?? (t.description?.split(' ')[0] ?? 'Uncategorized');
    totals.set(key, (totals.get(key) ?? 0) + convertedAmount);
  }

  const rows = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle>Top Categories (Expenses)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Aggregated in {baseCurrency}. Exchange rates are mock.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, amount]) => (
                <tr key={name} className="border-t border-border">
                  <td className="py-2 pr-4">{name}</td>
                  <td className="py-2 pr-4 text-right">{formatCurrency(amount, baseCurrency)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-muted-foreground" colSpan={2}>No expense data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}