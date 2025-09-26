import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCsv } from '@/utils/csv';
import type { Account, Transaction } from '@/types';

type MappingKey = 'date' | 'description' | 'amount' | 'account' | 'type' | 'currency';

interface ImportCsvModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onImport: (rows: Array<Omit<Transaction, 'id' | 'createdAtIso' | 'updatedAtIso'>>) => void;
}

export function ImportCsvModal({ open, onClose, accounts, onImport }: ImportCsvModalProps) {
  const [fileText, setFileText] = useState<string>('');
  const [mapping, setMapping] = useState<Record<MappingKey, string>>({
    date: '',
    description: '',
    amount: '',
    account: '',
    type: '',
    currency: '',
  });
  const [fallbackAccountId, setFallbackAccountId] = useState<string>(accounts[0]?.id ?? '');
  const [errors, setErrors] = useState<string[]>([]);

  const parsed = useMemo(() => {
    if (!fileText) return undefined;
    try {
      return parseCsv(fileText);
    } catch (e) {
      return undefined;
    }
  }, [fileText]);

  if (!open) return null;

  const headers = parsed?.headers ?? [];

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFileText(String(reader.result ?? ''));
    };
    reader.readAsText(file);
  }

  function buildTransactions() {
    const errs: string[] = [];
    const m = mapping;
    const required: MappingKey[] = ['date', 'amount'];
    for (const key of required) {
      if (!m[key]) errs.push(`Map field: ${key}`);
    }
    if (errs.length) {
      setErrors(errs);
      return;
    }
    const rows = parsed?.rows ?? [];
    const dateIdx = headers.indexOf(m.date);
    const amountIdx = headers.indexOf(m.amount);
    const descIdx = m.description ? headers.indexOf(m.description) : -1;
    const currencyIdx = m.currency ? headers.indexOf(m.currency) : -1;
    const typeIdx = m.type ? headers.indexOf(m.type) : -1;
    const acctIdx = m.account ? headers.indexOf(m.account) : -1;

    const result: Array<Omit<Transaction, 'id' | 'createdAtIso' | 'updatedAtIso'>> = [];
    for (const r of rows) {
      const accountId = acctIdx >= 0 ? accounts.find(a => a.name === r[acctIdx])?.id ?? fallbackAccountId : fallbackAccountId;
      const currency = currencyIdx >= 0 ? r[currencyIdx] || 'USD' : 'USD';
      const type = (typeIdx >= 0 ? (r[typeIdx] || '').toLowerCase() : (Number(r[amountIdx]) < 0 ? 'expense' : 'income')) as Transaction['type'];
      const rawAmount = Number(r[amountIdx]);
      const amount = Math.abs(isNaN(rawAmount) ? 0 : rawAmount);
      result.push({
        accountId,
        currency,
        type,
        amount,
        dateIso: new Date(r[dateIdx]).toISOString(),
        description: descIdx >= 0 ? r[descIdx] : undefined,
      });
    }
    onImport(result);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Import CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input type="file" accept=".csv,text/csv" onChange={handleFile} />

            {headers.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(mapping) as MappingKey[]).map(k => (
                  <div key={k}>
                    <label className="block text-sm mb-1">{k}</label>
                    <select
                      className="w-full border rounded px-3 py-2 bg-background"
                      value={mapping[k]}
                      onChange={(e) => setMapping({ ...mapping, [k]: e.target.value })}
                    >
                      <option value="">(not mapped)</option>
                      {headers.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">Fallback Account</label>
              <select
                className="w-full border rounded px-3 py-2 bg-background max-w-xs"
                value={fallbackAccountId}
                onChange={(e) => setFallbackAccountId(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {parsed && (
              <div>
                <div className="text-sm font-medium mb-2">Preview ({parsed.rows.length} rows)</div>
                <div className="overflow-x-auto border rounded">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        {parsed.headers.map(h => (
                          <th key={h} className="text-left p-2 border-b">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.rows.slice(0, 5).map((r, i) => (
                        <tr key={i} className="border-t">
                          {r.map((c, j) => (
                            <td key={j} className="p-2">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {errors.length > 0 && (
              <div className="text-destructive text-sm">
                {errors.join(', ')}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button disabled={!parsed} onClick={buildTransactions}>Import</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




