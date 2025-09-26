import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccountCard } from '@/components/AccountCard';
import { AddAccountModal } from '@/components/AddAccountModal';
import { useAccounts, useUpsertAccount } from '@/hooks/useAccounts';
import type { Account } from '@/types';

export const AccountsPage = () => {
  const { data: accounts = [] } = useAccounts();
  const upsertAccount = useUpsertAccount();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsAddAccountOpen(true);
  };

  const handleSaveAccount = (account: Omit<Account, 'id' | 'lastUpdatedIso'> & { id?: string }) => {
    upsertAccount.mutate({ ...account, lastUpdatedIso: new Date().toISOString() });
  };

  const handleCloseAccountModal = () => {
    setIsAddAccountOpen(false);
    setEditingAccount(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Accounts</h2>
        <Button className="btn-gradient" onClick={handleAddAccount}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">No accounts added yet</h3>
          <p className="mb-4">
            Start by adding your checking, savings, or credit card accounts.
          </p>
          <Button className="btn-gradient" onClick={handleAddAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Account
          </Button>
        </div>
      )}

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={handleCloseAccountModal}
        onSave={handleSaveAccount}
        initialData={editingAccount}
      />
    </div>
  );
};