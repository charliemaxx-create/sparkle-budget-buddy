import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCsv } from '@/utils/csv';
import type { Account, Transaction, CurrencyCode } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { currencyCodes } from '@/utils/currency'; // Import currencyCodes

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
  const [fallbackCurrency, setFallbackCurrency] = useState<CurrencyCode>('USD'); // New fallback currency state
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
      const currency = currencyIdx >= 0 ? (r[currencyIdx] as CurrencyCode || fallbackCurrency) : fallbackCurrency;
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
                    <Label className="block text-sm mb-1">{k}</Label>
                    <Select
                      value={mapping[k]}
                      onValueChange={(value) => setMapping({ ...mapping, [k]: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="(not mapped)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">(not mapped)</SelectItem>
                        {headers.map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm mb-1">Fallback Account</Label>
                <Select
                  value={fallbackAccountId}
                  onValueChange={setFallbackAccountId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm mb-1">Fallback Currency</Label>
                <Select
                  value={fallbackCurrency}
                  onValueChange={setFallbackCurrency}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyCodes.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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