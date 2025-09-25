import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddSavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (goal: {
    name: string;
    description?: string;
    target_amount: number;
    target_date?: string;
    category?: string;
    icon: string;
    color: string;
  }) => void;
}

const goalCategories = [
  'Emergency Fund',
  'Vacation',
  'Home Purchase',
  'Car',
  'Education',
  'Retirement',
  'Investment',
  'Other'
];

const goalIcons = [
  '🎯', '💰', '🏠', '🚗', '✈️', '🎓', '💎', '🌟', '🎉', '💡'
];

const goalColors = [
  '#10B981', // success
  '#6366F1', // indigo  
  '#F59E0B', // warning
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16'  // lime
];

export const AddSavingsGoalModal = ({ isOpen, onClose, onAdd }: AddSavingsGoalModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#10B981');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !targetAmount || isNaN(Number(targetAmount))) {
      return;
    }

    if (onAdd) {
      onAdd({
        name: name.trim(),
        description: description.trim() || undefined,
        target_amount: Number(targetAmount),
        target_date: targetDate || undefined,
        category: category || undefined,
        icon,
        color
      });
    }

    // Reset form
    setName('');
    setDescription('');
    setTargetAmount('');
    setTargetDate('');
    setCategory('');
    setIcon('🎯');
    setColor('#10B981');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setTargetAmount('');
    setTargetDate('');
    setCategory('');
    setIcon('🎯');
    setColor('#10B981');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Savings Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Goal Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund, Vacation..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description of your goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="targetAmount">Target Amount *</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {goalCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="grid w-full gap-1.5">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {goalIcons.map((emoji) => (
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
                {goalColors.map((colorOption) => (
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
              Add Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};