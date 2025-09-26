import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { CurrencyCode } from '@/types';
import { currencyCodes } from '@/utils/currency'; // Import currencyCodes

interface AddRecurringTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (transaction: {
    name: string;
    description?: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
    start_date: string;
    end_date?: string;
    account_id?: string;
    tags?: string[];
    currency: CurrencyCode; // Added currency
  }) => void;
}

const transactionCategories = {
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Insurance',
    'Other'
  ],
  income: [
    'Salary',
    'Freelance',
    'Investment',
    'Rental',
    'Business',
    'Side Hustle',
    'Gift',
    'Other'
  ]
};

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const AddRecurringTransactionModal = ({ isOpen, onClose, onAdd }: AddRecurringTransactionModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [tags, setTags] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD'); // New currency state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !amount || isNaN(Number(amount)) || !category) {
      return;
    }

    if (onAdd) {
      onAdd({
        name: name.trim(),
        description: description.trim() || undefined,
        amount: Number(amount),
        type,
        category,
        frequency,
        start_date: startDate,
        end_date: hasEndDate && endDate ? endDate : undefined,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        currency, // Pass currency
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
    setFrequency('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setHasEndDate(false);
    setEndDate('');
    setTags('');
    setCurrency('USD'); // Reset currency
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Recurring Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Transaction Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Netflix Subscription, Salary..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={currency} onValueChange={(value: CurrencyCode) => setCurrency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyCodes.map((cc) => (
                    <SelectItem key={cc.value} value={cc.value}>
                      {cc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={(value: 'income' | 'expense') => {
                setType(value);
                setCategory(''); // Reset category when type changes
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories[type].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasEndDate"
              checked={hasEndDate}
              onCheckedChange={setHasEndDate}
            />
            <Label htmlFor="hasEndDate">Set end date</Label>
          </div>

          {hasEndDate && (
            <div className="grid w-full gap-1.5">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          )}

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              e.g., subscription, bills, entertainment
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              Add Recurring Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};