import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types/financial';
import { expenseCategories, incomeCategories } from '@/types/financial';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList = ({ 
  transactions, 
  onUpdateTransaction, 
  onDeleteTransaction 
}: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    description: '',
    category: '',
  });
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
    });
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;
    
    onUpdateTransaction(editingTransaction.id, {
      amount: parseFloat(editForm.amount),
      description: editForm.description,
      category: editForm.category,
    });
    
    setEditingTransaction(null);
    toast({
      title: "Transaction Updated",
      description: "Your transaction has been successfully updated",
    });
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    toast({
      title: "Transaction Deleted",
      description: "Your transaction has been removed",
    });
  };

  const getCategoryIcon = (category: string, type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const cat = categories.find(c => c.name === category);
    return cat?.icon || '📝';
  };

  if (transactions.length === 0) {
    return (
      <Card className="financial-card text-center py-8">
        <div className="text-4xl mb-2">📊</div>
        <h3 className="text-lg font-semibold mb-1">No Transactions Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start by adding your first income or expense above
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="financial-card">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {getCategoryIcon(transaction.category, transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.type === 'income' 
                            ? 'border-income/30 text-income' 
                            : 'border-expense/30 text-expense'
                        }`}
                      >
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-income' : 'text-expense'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(transaction)}
                      className="h-8 w-8 p-0 hover:bg-primary/20"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(transaction.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {transactions.length > 10 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing recent 10 transactions
            </p>
          )}
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(editingTransaction?.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
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
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingTransaction(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};