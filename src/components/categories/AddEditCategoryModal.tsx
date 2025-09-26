import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryItem } from '@/services/categories';
import type { TransactionType } from '@/types';

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<CategoryItem, 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => void;
  initialData?: CategoryItem | null;
}

const categoryIcons = [
  '🏷️', '🛒', '🍽️', '🚗', '🛍️', '🎬', '💡', '🏥', '🎓', '✈️', '🛡️', '🏠', '💅', '✨', '💰', '📈', '🎁', '🐾', '👶', '🛠️', '💳'
];

const categoryColors = [
  '#10B981', // success
  '#6366F1', // indigo  
  '#F59E0B', // warning
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16', // lime
  '#EC4899', // pink
  '#3B82F6', // blue
];

export const AddEditCategoryModal = ({ isOpen, onClose, onSave, initialData }: AddEditCategoryModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState('🏷️');
  const [color, setColor] = useState('#6366F1');

  const { data: categories = [] } = useCategories();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type as TransactionType);
      setParentId(initialData.parent_id || null);
      setIcon(initialData.icon || '🏷️');
      setColor(initialData.color || '#6366F1');
    } else {
      setName('');
      setType('expense');
      setParentId(null);
      setIcon('🏷️');
      setColor('#6366F1');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      // Basic validation
      return;
    }

    onSave({
      id: initialData?.id,
      name: name.trim(),
      type,
      parent_id: parentId,
      icon,
      color,
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const filteredParentCategories = categories.filter(cat => cat.id !== initialData?.id && cat.parent_id === null);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Groceries, Salary..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="type">Category Type *</Label>
            <Select value={type} onValueChange={(value: TransactionType) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="parent">Parent Category (Optional)</Label>
            <Select value={parentId || ''} onValueChange={(value) => setParentId(value === '' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Parent</SelectItem>
                {filteredParentCategories.filter(cat => cat.type === type).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {categoryIcons.map((emoji) => (
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
              {categoryColors.map((colorOption) => (
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