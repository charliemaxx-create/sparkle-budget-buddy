import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Mail, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TransactionType } from '@/types'; // Import TransactionType

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const transactionCategories = {
  expense: [
    'Food & Dining',
    'Groceries',
    'Restaurants',
    'Transportation',
    'Fuel',
    'Public Transport',
    'Car Maintenance',
    'Shopping',
    'Clothing',
    'Electronics',
    'Home Goods',
    'Entertainment',
    'Movies & Music',
    'Hobbies',
    'Social Events',
    'Bills & Utilities',
    'Rent/Mortgage',
    'Electricity',
    'Water',
    'Internet',
    'Phone',
    'Healthcare',
    'Doctor Visits',
    'Medication',
    'Insurance',
    'Education',
    'Tuition',
    'Books',
    'Travel',
    'Flights',
    'Accommodation',
    'Personal Care',
    'Haircuts',
    'Gym',
    'Gifts & Donations',
    'Pets',
    'Childcare',
    'Home Improvement',
    'Debt Payments',
    'Other'
  ],
  income: [
    'Salary',
    'Freelance',
    'Investment',
    'Rental',
    'Business',
    'Side Hustle',
    'Gift',
    'Other'
  ]
};

export const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense'); // New state for transaction type
  const { toast } = useToast();

  // Mock accounts for now, ideally fetched from useAccounts
  const accounts = [
    'Chase Checking',
    'Savings Account',
    'Credit Card',
    'Cash'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Transaction Added",
      description: `$${amount} ${transactionType} for ${category} has been recorded.`,
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setAccount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTransactionType('expense'); // Reset type
    onClose();
  };

  const handleReceiptUpload = () => {
    toast({
      title: "Receipt Processing",
      description: "Receipt uploaded and being processed with OCR technology.",
    });
  };

  const handleEmailFetch = () => {
    toast({
      title: "Email Sync",
      description: "Fetching transactions from your connected email account.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="receipt">Upload Receipt</TabsTrigger>
            <TabsTrigger value="email">Email Sync</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label> {/* New Type Selector */}
                  <Select value={transactionType} onValueChange={(value: TransactionType) => {
                    setTransactionType(value);
                    setCategory(''); // Reset category when type changes
                  }} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionType === 'transfer' ? (
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      ) : (
                        transactionCategories[transactionType]?.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select value={account} onValueChange={setAccount} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc} value={acc}>
                        {acc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add notes about this transaction..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="receipt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Receipt</CardTitle>
                <CardDescription>
                  Upload a photo of your receipt and we'll extract the transaction details automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your receipt here, or click to browse
                  </p>
                  <Button onClick={handleReceiptUpload} className="btn-gradient">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sync with Email</CardTitle>
                <CardDescription>
                  Connect your email to automatically import transaction receipts and confirmations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll scan your email for purchase confirmations and receipts
                  </p>
                  <Button onClick={handleEmailFetch} className="btn-gradient">
                    <Mail className="h-4 w-4 mr-2" />
                    Sync Email Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};