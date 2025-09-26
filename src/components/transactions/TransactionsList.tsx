import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccounts } from '@/hooks/useAccounts';
import { useDeleteTransaction, useTransactions, useUpsertTransaction } from '@/hooks/useTransactions';
import { TransactionModal } from './TransactionModal';
import { ImportCsvModal } from './ImportCsvModal';
import { formatCurrency } from '@/utils/currency'; // Import formatCurrency

export function TransactionsList() {
  const { data: accounts = [] } = useAccounts();
  const [page, setPage] = useState(1);
  const { data } = useTransactions(undefined, page, 20);
  const upsert = useUpsertTransaction();
  const del = useDeleteTransaction();
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>Import CSV</Button>
          <Button className="btn-gradient" onClick={() => setOpen(true)}>Add Transaction</Button>
        </div>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Account</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4 text-right">Amount</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {(data?.items ?? []).map(tx => {
                  const account = accounts.find(a => a.id === tx.accountId);
                  const amount = (tx.type === 'expense' ? -1 : 1) * tx.amount;
                  return (
                    <tr key={tx.id} className="border-t border-border">
                      <td className="py-2 pr-4">{tx.dateIso.slice(0, 10)}</td>
                      <td className="py-2 pr-4">{account?.name ?? tx.accountId}</td>
                      <td className="py-2 pr-4">{tx.description}</td>
                      <td className={`py-2 pr-4 text-right ${amount < 0 ? 'text-destructive' : 'text-success'}`}>
                        {formatCurrency(Math.abs(tx.amount), tx.currency)}
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => del.mutate(tx.id)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })}
                {data && data.items.length === 0 && (
                  <tr>
                    <td className="py-6 text-center text-muted-foreground" colSpan={5}>No transactions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
            <div className="text-xs text-muted-foreground">Page {page}</div>
            <Button variant="outline" disabled={(data?.items.length ?? 0) < 20} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>

      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        accounts={accounts}
        onSave={(input) => upsert.mutate(input)}
      />

      <ImportCsvModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        accounts={accounts}
        onImport={(rows) => {
          for (const r of rows) upsert.mutate(r);
        }}
      />
    </div>
  );
}