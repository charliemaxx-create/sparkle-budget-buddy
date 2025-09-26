import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpendingData {
  category: string;
  amount: number;
  color: string;
}

interface SpendingChartProps {
  data: SpendingData[];
}

export const SpendingChart = ({ data }: SpendingChartProps) => {
  const totalSpent = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="card-elevated animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: ${totalSpent.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = ((item.amount / totalSpent) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    ${item.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};