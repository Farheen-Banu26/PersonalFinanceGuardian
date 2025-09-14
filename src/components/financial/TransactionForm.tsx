import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/types/financial';
import { expenseCategories, incomeCategories } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date().toISOString().split('T')[0],
    };

    onAddTransaction(transaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    
    toast({
      title: "Transaction Added",
      description: `${type === 'income' ? 'Income' : 'Expense'} of $${amount} has been recorded`,
    });
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Card className="financial-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Add Transaction</h3>
          <p className="text-sm text-muted-foreground">Record your income or expenses</p>
        </div>

        <Tabs value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income" className="data-[state=active]:bg-income/20 data-[state=active]:text-income">
              💰 Income
            </TabsTrigger>
            <TabsTrigger value="expense" className="data-[state=active]:bg-expense/20 data-[state=active]:text-expense">
              💸 Expense
            </TabsTrigger>
          </TabsList>

          <TabsContent value={type} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className={`w-full ${
                type === 'income' 
                  ? 'bg-income hover:bg-income/90 text-income-foreground' 
                  : 'bg-expense hover:bg-expense/90 text-expense-foreground'
              }`}
            >
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </TabsContent>
        </Tabs>
      </form>
    </Card>
  );
};