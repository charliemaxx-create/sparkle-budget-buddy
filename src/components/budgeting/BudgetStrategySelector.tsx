import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Wallet, Target, Layers, Calculator } from 'lucide-react';

interface BudgetStrategy {
  id: string;
  type: '50-30-20' | 'envelope' | 'pay-yourself-first' | 'expense-buckets' | 'traditional';
  name: string;
  description: string;
  pros: string[];
  bestFor: string;
  icon: React.ReactNode;
}

const budgetStrategies: BudgetStrategy[] = [
  {
    id: '50-30-20',
    type: '50-30-20',
    name: '50-30-20 Rule',
    description: 'Simple percentage-based budgeting: 50% needs, 30% wants, 20% savings',
    pros: ['Easy to understand', 'Balanced approach', 'Great for beginners'],
    bestFor: 'People with stable income who want a simple budgeting framework',
    icon: <PieChart className="h-6 w-6" />
  },
  {
    id: 'envelope',
    type: 'envelope',
    name: 'Envelope Method',
    description: 'Allocate cash to different spending categories (envelopes)',
    pros: ['Prevents overspending', 'Visual control', 'Cash-based mindset'],
    bestFor: 'People who struggle with overspending and want strict limits',
    icon: <Wallet className="h-6 w-6" />
  },
  {
    id: 'pay-yourself-first',
    type: 'pay-yourself-first',
    name: 'Pay Yourself First',
    description: 'Prioritize savings and investments before any other expenses',
    pros: ['Guaranteed savings', 'Wealth building focus', 'Automated approach'],
    bestFor: 'People focused on long-term wealth building and financial goals',
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 'expense-buckets',
    type: 'expense-buckets',
    name: 'Expense Buckets',
    description: 'Categorize expenses into Fixed, Flexible, and Non-Monthly buckets',
    pros: ['Detailed tracking', 'Handles irregular expenses', 'Flexible approach'],
    bestFor: 'People with variable income or irregular expenses',
    icon: <Layers className="h-6 w-6" />
  },
  {
    id: 'traditional',
    type: 'traditional',
    name: 'Traditional Budgeting',
    description: 'Classic category-based budgeting with detailed expense tracking',
    pros: ['Comprehensive control', 'Detailed insights', 'Customizable'],
    bestFor: 'People who want complete control over every expense category',
    icon: <Calculator className="h-6 w-6" />
  }
];

interface BudgetStrategySelectorProps {
  selectedStrategy?: string;
  onSelectStrategy: (strategyType: string) => void;
}

export const BudgetStrategySelector = ({ selectedStrategy, onSelectStrategy }: BudgetStrategySelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Budgeting Strategy</h2>
        <p className="text-muted-foreground">
          Different strategies work better for different people. Choose the one that fits your lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetStrategies.map((strategy) => (
          <Card 
            key={strategy.id}
            className={`card-elevated animate-fade-in cursor-pointer transition-all hover:shadow-lg ${
              selectedStrategy === strategy.type ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectStrategy(strategy.type)}
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {strategy.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  </div>
                </div>
                {selectedStrategy === strategy.type && (
                  <Badge className="bg-success text-success-foreground">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {strategy.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {strategy.pros.map((pro, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-success rounded-full mr-2"></span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Best For:</h4>
                <p className="text-sm text-muted-foreground">
                  {strategy.bestFor}
                </p>
              </div>

              <Button 
                className={`w-full ${selectedStrategy === strategy.type ? 'btn-gradient' : ''}`}
                variant={selectedStrategy === strategy.type ? 'default' : 'outline'}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStrategy(strategy.type);
                }}
              >
                {selectedStrategy === strategy.type ? 'Currently Active' : 'Select This Strategy'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};