import { useState } from 'react';
import { Wallet, PieChart, TrendingDown, Receipt, Settings, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Wallet },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'savings', label: 'Savings Goals', icon: Target },
  { id: 'debts', label: 'Debts', icon: TrendingDown },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'profile', label: 'Profile', icon: Settings },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTransaction: () => void;
}

export const Navigation = ({ activeTab, onTabChange, onAddTransaction }: NavigationProps) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Wallet className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-foreground">FinanceTracker</h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Add Transaction Button */}
          <Button onClick={onAddTransaction} className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeTab === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};