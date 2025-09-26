import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { CashflowPieChart } from './CashflowPieChart'; // Import the new pie chart component

export function CashflowSummary() {
  const { data } = useTransactions(undefined, 1, 1000); // Fetch transactions
  const items = data?.items ?? [];

  // Get current month's start and end dates
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const filteredTransactions = items.filter(t => {
    const transactionDate = new Date(t.dateIso);
    return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle>Cashflow (Current Month)</CardTitle>
      </CardHeader>
      <CashflowPieChart income={totalIncome} expenses={totalExpenses} />
    </Card>
  );
}