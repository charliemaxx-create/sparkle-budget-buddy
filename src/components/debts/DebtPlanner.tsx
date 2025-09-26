import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDebts } from '@/hooks/useDebts';
import { buildDebtPlan, Strategy } from '@/utils/debtPlanner';

export function DebtPlanner() {
  const { data: debts = [] } = useDebts();
  const [strategy, setStrategy] = useState<Strategy>('snowball');
  const [extra, setExtra] = useState<number>(200);

  const plan = useMemo(() => buildDebtPlan(debts, extra, strategy), [debts, extra, strategy]);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle>Debt Payoff Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Strategy</label>
              <select className="w-full border rounded px-3 py-2 bg-background" value={strategy} onChange={(e) => setStrategy(e.target.value as Strategy)}>
                <option value="snowball">Snowball (smallest balance first)</option>
                <option value="avalanche">Avalanche (highest APR first)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Extra Monthly Payment</label>
              <input type="number" className="w-full border rounded px-3 py-2 bg-background" value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { /* recalculated via useMemo */ }}>Recalculate</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Debts</div>
              <div className="text-2xl font-bold">{debts.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Months to Payoff</div>
              <div className="text-2xl font-bold">{plan.monthsToPayoff}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Interest (estimated)</div>
              <div className="text-2xl font-bold">${plan.interestPaidTotal.toLocaleString()}</div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-2">Month</th>
                  <th className="text-left p-2">Debt ID</th>
                  <th className="text-right p-2">Payment</th>
                  <th className="text-right p-2">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {plan.steps.slice(0, 60).map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{s.monthIndex + 1}</td>
                    <td className="p-2">{s.debtId}</td>
                    <td className="p-2 text-right">${s.payment.toFixed(2)}</td>
                    <td className="p-2 text-right">${s.remainingBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



