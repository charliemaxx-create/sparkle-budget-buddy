import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BudgetItem } from '@/services/budgets';

interface AddBudgetCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<BudgetItem, 'id' | 'spent' | 'color' | 'icon'> & { id?: string; icon: string; color: string }) => void;
  initialData?: BudgetItem | null;
}

const budgetCategories = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities',
  'Healthcare', 'Education', 'Travel', 'Insurance', 'Housing', 'Personal Care', 'Other'
];

const budgetIcons = [
  '🍽️', '🚗', '🛍️', '🎬', '💡', '🏥', '🎓', '✈️', '🛡️', '🏠', '💅', '✨'
];

const budgetColors = [
  '#10B981', // success
  '#6366F1', // indigo  
  '#F59E0B', // warning
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16'  // lime
];

export const AddBudgetCategoryModal = ({ isOpen, onClose, onSave, initialData }: AddBudgetCategoryModalProps) => {
  const [name, setName] = useState('');
  const [allocated, setAllocated] = useState('');
  const [icon, setIcon] = useState('🍽️');
  const [color, setColor] = useState('#10B981');

  useEffect(() => {
    if (initialData) {
      setName(initialData.category);
      setAllocated(initialData.allocated.toString());
      setIcon(initialData.icon);
      setColor(initialData.color);
    } else {
      setName('');
      setAllocated('');
      setIcon('🍽️');
      setColor('#10B981');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !allocated || isNaN(Number(allocated)) || Number(allocated) <= 0) {
      // Basic validation
      return;
    }

    onSave({
      id: initialData?.id,
      category: name.trim(),
      allocated: Number(allocated),
      icon,
      color,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Budget Category' : 'Add New Budget Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Category Name *</Label>
            <Select value={name} onValueChange={setName}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {budgetCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="allocated">Allocated Amount *</Label>
            <Input
              id="allocated"
              type="number"
              placeholder="0.00"
              value={allocated}
              onChange={(e) => setAllocated(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="grid w-full gap-1.5">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {budgetIcons.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`p-2 rounded border-2 hover:bg-muted ${
                      icon === emoji ? 'border-primary' : 'border-border'
                    }`}
                    onClick={() => setIcon(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid w-full gap-1.5">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {budgetColors.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === colorOption ? 'border-foreground' : 'border-border'
                    }`}
                    style={{ backgroundColor: colorOption }}
                    onClick={() => setColor(colorOption)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              {initialData ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};