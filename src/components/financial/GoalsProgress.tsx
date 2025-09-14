import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Goal } from '@/types/financial';
import { Plus, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoalsProgressProps {
  goals: Goal[];
  savings: number;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, goal: Partial<Goal>) => void;
}

export const GoalsProgress = ({ goals, savings, onAddGoal, onUpdateGoal }: GoalsProgressProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in goal name and target amount",
        variant: "destructive",
      });
      return;
    }

    onAddGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      savedAmount: 0,
      deadline: newGoal.deadline || undefined,
    });

    setNewGoal({ name: '', targetAmount: '', deadline: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Goal Created",
      description: `Your ${newGoal.name} goal has been set!`,
    });
  };

  const allocateSavings = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newSavedAmount = Math.min(goal.savedAmount + amount, goal.targetAmount);
    onUpdateGoal(goalId, { savedAmount: newSavedAmount });
    
    toast({
      title: "Savings Allocated",
      description: `$${amount} allocated to ${goal.name}`,
    });
  };

  return (
    <Card className="financial-card-savings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-savings" />
              Savings Goals
            </h3>
            <p className="text-sm text-muted-foreground">
              Available: {formatCurrency(savings)}
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-savings hover:bg-savings/90 text-savings-foreground">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-amount">Target Amount</Label>
                  <Input
                    id="goal-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Deadline (Optional)</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleAddGoal} className="w-full">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <h4 className="font-medium mb-1">No Goals Yet</h4>
            <p className="text-sm text-muted-foreground">
              Set your first savings goal to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.savedAmount / goal.targetAmount) * 100;
              const isCompleted = goal.savedAmount >= goal.targetAmount;
              
              return (
                <div key={goal.id} className="space-y-3 p-4 rounded-lg border border-border/30 bg-card/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{goal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(goal.savedAmount)} of {formatCurrency(goal.targetAmount)}
                        {goal.deadline && (
                          <span className="ml-2">
                            • Due {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={`text-lg font-bold ${isCompleted ? 'text-success' : 'text-savings'}`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className={`h-2 ${isCompleted ? 'progress-bar-glow' : ''}`}
                  />
                  
                  {!isCompleted && savings > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => allocateSavings(goal.id, Math.min(100, savings))}
                        className="text-xs"
                      >
                        +$100
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => allocateSavings(goal.id, Math.min(500, savings))}
                        className="text-xs"
                      >
                        +$500
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => allocateSavings(goal.id, savings)}
                        className="text-xs"
                      >
                        All ({formatCurrency(savings)})
                      </Button>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="flex items-center gap-2 text-success text-sm font-medium">
                      <span>🎉</span>
                      Goal Completed!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};