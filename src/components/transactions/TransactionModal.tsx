import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Account, Transaction, TransactionType } from '@/types';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: Omit<Transaction, 'id' | 'createdAtIso' | 'updatedAtIso'> & { id?: string }) => void;
  accounts: Account[];
  initial?: Transaction;
}

export function TransactionModal({ open, onClose, onSave, accounts, initial }: TransactionModalProps) {
  const [form, setForm] = useState<{
    id?: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    dateIso: string;
    description?: string;
  }>({
    accountId: accounts[0]?.id ?? '',
    type: 'expense',
    amount: 0,
    currency: 'USD',
    dateIso: new Date().toISOString().slice(0, 10),
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id,
        accountId: initial.accountId,
        type: initial.type,
        amount: initial.amount,
        currency: initial.currency,
        dateIso: initial.dateIso.slice(0, 10),
        description: initial.description,
      });
    }
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{initial ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Account</label>
              <select
                className="w-full border rounded px-3 py-2 bg-background"
                value={form.accountId}
                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  className="w-full border rounded px-3 py-2 bg-background"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded px-3 py-2 bg-background"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                />
                {errors.amount && <div className="text-destructive text-xs mt-1">{errors.amount}</div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Currency</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-background"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 bg-background"
                  value={form.dateIso}
                  onChange={(e) => setForm({ ...form, dateIso: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <input
                className="w-full border rounded px-3 py-2 bg-background"
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => {
                  const nextErrors: Record<string, string> = {};
                  if (!form.accountId) nextErrors.accountId = 'Select an account';
                  if (!form.amount || form.amount <= 0) nextErrors.amount = 'Enter a positive amount';
                  if (!form.currency) nextErrors.currency = 'Currency is required';
                  if (!form.dateIso) nextErrors.dateIso = 'Date is required';
                  setErrors(nextErrors);
                  if (Object.keys(nextErrors).length > 0) return;

                  const payload = {
                    ...form,
                    dateIso: new Date(form.dateIso).toISOString(),
                  } as Omit<Transaction, 'id' | 'createdAtIso' | 'updatedAtIso'> & { id?: string };
                  onSave(payload);
                  onClose();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



