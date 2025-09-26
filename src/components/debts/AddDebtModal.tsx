import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { DebtItem } from '@/services/debts';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (debt: Omit<DebtItem, 'id'>) => void;
}

const debtTypes = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'auto_loan', label: 'Auto Loan' },
  { value: 'student_loan', label: 'Student Loan' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'other', label: 'Other' },
];

export const AddDebtModal = ({ isOpen, onClose, onAdd }: AddDebtModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DebtItem['type']>('credit_card');
  const [balance, setBalance] = useState('');
  const [originalAmount, setOriginalAmount] = useState(''); // Added originalAmount state
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !balance || isNaN(Number(balance)) || Number(balance) <= 0 || !originalAmount || isNaN(Number(originalAmount)) || Number(originalAmount) <= 0 || !interestRate || isNaN(Number(interestRate)) || !minimumPayment || isNaN(Number(minimumPayment)) || Number(minimumPayment) <= 0) {
      // Basic validation
      return;
    }

    if (onAdd) {
      onAdd({
        name: name.trim(),
        type,
        balance: Number(balance),
        originalAmount: Number(originalAmount), // Included originalAmount
        interestRate: Number(interestRate),
        minimumPayment: Number(minimumPayment),
        nextPaymentDate: nextPaymentDate || undefined,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setType('credit_card');
    setBalance('');
    setOriginalAmount(''); // Reset originalAmount
    setInterestRate('');
    setMinimumPayment('');
    setNextPaymentDate('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Debt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Debt Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Credit Card, Student Loan..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="type">Debt Type *</Label>
            <Select value={type} onValueChange={(value: DebtItem['type']) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select debt type" />
              </SelectTrigger>
              <SelectContent>
                {debtTypes.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="balance">Current Balance *</Label>
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="originalAmount">Original Amount *</Label>
              <Input
                id="originalAmount"
                type="number"
                placeholder="0.00"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="interestRate">Interest Rate (APR %) *</Label>
              <Input
                id="interestRate"
                type="number"
                placeholder="0.00"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="minimumPayment">Minimum Payment *</Label>
              <Input
                id="minimumPayment"
                type="number"
                placeholder="0.00"
                value={minimumPayment}
                onChange={(e) => setMinimumPayment(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
            <Input
              id="nextPaymentDate"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Any additional notes about this debt..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              Add Debt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};