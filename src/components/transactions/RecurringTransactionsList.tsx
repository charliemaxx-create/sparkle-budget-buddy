import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Plus } from 'lucide-react';
import { useRecurring, useDeleteRecurring, useToggleRecurring, useUpsertRecurring } from '@/hooks/useRecurring';
import { RecurringTransactionCard } from '@/components/RecurringTransactionCard';
import { AddRecurringTransactionModal } from '@/components/AddRecurringTransactionModal';

export function RecurringTransactionsList() {
  const { data: recurring = [] } = useRecurring();
  const upsertRecurring = useUpsertRecurring();
  const delRecurring = useDeleteRecurring();
  const toggleRecurring = useToggleRecurring();

  const [isAddRecurringTransactionOpen, setIsAddRecurringTransactionOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="btn-gradient" onClick={() => setIsAddRecurringTransactionOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recurring Transaction
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recurring.map((transaction) => (
          <RecurringTransactionCard 
            key={transaction.id} 
            transaction={transaction as any}
            onToggleActive={(id, active) => toggleRecurring.mutate({ id, active })}
            onEdit={(id) => {
              // TODO: Implement edit functionality for recurring transactions
              console.log(`Editing recurring transaction ${id}`);
            }}
            onDelete={(id) => delRecurring.mutate(id)}
          />
        ))}
      </div>
      
      {recurring.length === 0 && (
        <Card className="card-elevated animate-fade-in">
          <CardContent className="text-center py-12">
            <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recurring transactions yet</h3>
            <p className="text-muted-foreground mb-4">
              Automate your finances! Set up recurring income and expenses.
            </p>
            <Button className="btn-gradient" onClick={() => setIsAddRecurringTransactionOpen(true)}>
              Add Your First Recurring Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      <AddRecurringTransactionModal
        isOpen={isAddRecurringTransactionOpen}
        onClose={() => setIsAddRecurringTransactionOpen(false)}
        onAdd={(transaction) => {
          upsertRecurring.mutate({ ...transaction, is_active: true });
        }}
      />
    </div>
  );
}