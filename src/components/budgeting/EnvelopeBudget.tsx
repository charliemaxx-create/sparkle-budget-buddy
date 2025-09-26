import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, Minus, Edit, Trash2 } from 'lucide-react';

interface Envelope {
  id: string;
  name: string;
  allocated: number;
  current: number;
  target?: number;
  color: string;
  icon: string;
  isVirtual: boolean;
}

interface EnvelopeBudgetProps {
  monthlyIncome: number;
}

export const EnvelopeBudget = ({ monthlyIncome }: EnvelopeBudgetProps) => {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([
    {
      id: '1',
      name: 'Groceries',
      allocated: 600,
      current: 450,
      target: 600,
      color: '#10B981',
      icon: '🛒',
      isVirtual: true
    },
    {
      id: '2',
      name: 'Gas & Transportation',
      allocated: 300,
      current: 150,
      target: 300,
      color: '#6366F1',
      icon: '⛽',
      isVirtual: true
    },
    {
      id: '3',
      name: 'Entertainment',
      allocated: 200,
      current: 180,
      target: 200,
      color: '#F59E0B',
      icon: '🎬',
      isVirtual: true
    },
    {
      id: '4',
      name: 'Dining Out',
      allocated: 250,
      current: 75,
      target: 250,
      color: '#EF4444',
      icon: '🍽️',
      isVirtual: true
    },
    {
      id: '5',
      name: 'Emergency Fund',
      allocated: 500,
      current: 500,
      target: 1000,
      color: '#8B5CF6',
      icon: '🚨',
      isVirtual: true
    }
  ]);

  const [isAddEnvelopeOpen, setIsAddEnvelopeOpen] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<Envelope | null>(null);
  const [transactionAmount, setTransactionAmount] = useState('');

  const totalAllocated = envelopes.reduce((sum, env) => sum + env.allocated, 0);
  const totalCurrent = envelopes.reduce((sum, env) => sum + env.current, 0);
  const unallocatedFunds = monthlyIncome - totalAllocated;

  const addMoney = (envelopeId: string, amount: number) => {
    setEnvelopes(prev => prev.map(env => 
      env.id === envelopeId 
        ? { ...env, current: Math.min(env.current + amount, env.target || Infinity) }
        : env
    ));
  };

  const spendMoney = (envelopeId: string, amount: number) => {
    setEnvelopes(prev => prev.map(env => 
      env.id === envelopeId 
        ? { ...env, current: Math.max(env.current - amount, 0) }
        : env
    ));
  };

  const transferMoney = (fromId: string, toId: string, amount: number) => {
    setEnvelopes(prev => prev.map(env => {
      if (env.id === fromId) {
        return { ...env, current: Math.max(env.current - amount, 0) };
      }
      if (env.id === toId) {
        return { ...env, current: env.current + amount };
      }
      return env;
    }));
  };

  const handleTransaction = (type: 'add' | 'spend') => {
    if (!selectedEnvelope || !transactionAmount) return;
    
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (type === 'add') {
      addMoney(selectedEnvelope.id, amount);
    } else {
      spendMoney(selectedEnvelope.id, amount);
    }

    setSelectedEnvelope(null);
    setTransactionAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Envelope Budget System
            </span>
            <Badge variant="outline">Cash-Based Control</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Monthly Income</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Allocated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${totalCurrent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Available Cash</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                unallocatedFunds >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                ${Math.abs(unallocatedFunds).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {unallocatedFunds >= 0 ? 'Unallocated' : 'Over Allocated'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Envelope Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Envelopes</h3>
        <Button className="btn-gradient" onClick={() => setIsAddEnvelopeOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Envelope
        </Button>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {envelopes.map((envelope) => {
          const percentage = envelope.target 
            ? (envelope.current / envelope.target) * 100 
            : envelope.allocated > 0 
              ? (envelope.current / envelope.allocated) * 100 
              : 0;
          
          const isLow = percentage < 20;
          const isEmpty = envelope.current === 0;

          return (
            <Card key={envelope.id} className="card-elevated animate-fade-in">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="text-2xl p-2 rounded-lg"
                      style={{ backgroundColor: `${envelope.color}20` }}
                    >
                      {envelope.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{envelope.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>${envelope.allocated.toLocaleString()} allocated</span>
                        {envelope.isVirtual && (
                          <Badge variant="outline" className="text-xs">Virtual</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: envelope.color }}>
                    ${envelope.current.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available to spend
                  </div>
                </div>

                {envelope.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to target</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      Target: ${envelope.target.toLocaleString()}
                    </div>
                  </div>
                )}

                {(isEmpty || isLow) && (
                  <Badge 
                    variant={isEmpty ? 'destructive' : 'outline'} 
                    className={`w-full justify-center ${!isEmpty ? 'text-warning border-warning' : ''}`}
                  >
                    {isEmpty ? 'Empty Envelope' : 'Running Low'}
                  </Badge>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedEnvelope(envelope);
                      setTransactionAmount('');
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    disabled={envelope.current === 0}
                    onClick={() => {
                      setSelectedEnvelope(envelope);
                      setTransactionAmount('');
                    }}
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    Spend
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transaction Dialog */}
      <Dialog 
        open={selectedEnvelope !== null} 
        onOpenChange={() => setSelectedEnvelope(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Transaction - {selectedEnvelope?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl">{selectedEnvelope?.icon}</div>
              <div className="font-semibold">{selectedEnvelope?.name}</div>
              <div className="text-sm text-muted-foreground">
                Current: ${selectedEnvelope?.current.toLocaleString()}
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 btn-gradient"
                onClick={() => handleTransaction('add')}
                disabled={!transactionAmount}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <Button 
                className="flex-1"
                variant="outline"
                onClick={() => handleTransaction('spend')}
                disabled={!transactionAmount || !selectedEnvelope || selectedEnvelope.current === 0}
              >
                <Minus className="h-4 w-4 mr-2" />
                Spend Money
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tips */}
      <Card className="card-elevated animate-fade-in">
        <CardHeader>
          <CardTitle>Envelope Method Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• When an envelope is empty, you're done spending in that category for the month</p>
          <p>• You can transfer money between envelopes if needed, but avoid it when possible</p>
          <p>• Start with just a few envelopes and add more as you get comfortable</p>
          <p>• Physical cash envelopes work great, but virtual envelopes offer more flexibility</p>
        </CardContent>
      </Card>
    </div>
  );
};