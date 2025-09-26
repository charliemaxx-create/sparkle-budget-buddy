import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CashflowPieChartProps {
  income: number;
  expenses: number;
}

export const CashflowPieChart = ({ income, expenses }: CashflowPieChartProps) => {
  const total = income + expenses;
  const net = income - expenses;

  if (total === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No income or expenses for this month.
      </div>
    );
  }

  const incomePercentage = (income / total) * 100;
  const expensesPercentage = (expenses / total) * 100;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray for income and expenses
  const incomeDasharray = `${(incomePercentage / 100) * circumference} ${circumference}`;
  const expensesDasharray = `${(expensesPercentage / 100) * circumference} ${circumference}`;

  return (
    <CardContent className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="20"
          />
          {/* Expenses segment (red) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="20"
            strokeDasharray={expensesDasharray}
            strokeDashoffset="0"
          />
          {/* Income segment (green) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="20"
            strokeDasharray={incomeDasharray}
            strokeDashoffset={-(expensesPercentage / 100) * circumference}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn(
            "text-xl font-bold",
            net >= 0 ? "text-success" : "text-destructive"
          )}>
            ${Math.abs(net).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Net</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <div className="text-sm">
            <div className="font-medium">Income</div>
            <div className="text-xs text-muted-foreground">${income.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <div className="text-sm">
            <div className="font-medium">Expenses</div>
            <div className="text-xs text-muted-foreground">${expenses.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};