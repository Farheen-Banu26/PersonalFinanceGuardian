import { useFinancialData } from '@/hooks/useFinancialData';
import { FinancialCard } from '@/components/financial/FinancialCard';
import { TransactionForm } from '@/components/financial/TransactionForm';
import { TransactionList } from '@/components/financial/TransactionList';
import { GoalsProgress } from '@/components/financial/GoalsProgress';
import { StreakCounter } from '@/components/financial/StreakCounter';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

const Index = () => {
  const {
    transactions,
    goals,
    streak,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    getFinancialSummary,
  } = useFinancialData();

  const summary = getFinancialSummary();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                💰 FinanceTracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Take control of your financial future
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`text-lg font-bold ${
                  summary.savings >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  ${summary.savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overview Cards & Streak */}
          <div className="lg:col-span-1 space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <FinancialCard
                title="Total Income"
                amount={summary.totalIncome}
                icon={<TrendingUp className="h-6 w-6" />}
                variant="income"
                trend={{
                  value: 12.5,
                  isPositive: true,
                }}
              />
              
              <FinancialCard
                title="Total Expenses"
                amount={summary.totalExpenses}
                icon={<TrendingDown className="h-6 w-6" />}
                variant="expense"
                trend={{
                  value: 3.2,
                  isPositive: false,
                }}
              />
              
              <FinancialCard
                title="Net Savings"
                amount={summary.savings}
                icon={<Wallet className="h-6 w-6" />}
                variant="savings"
                trend={{
                  value: 8.7,
                  isPositive: summary.savings >= 0,
                }}
              />
            </div>

            {/* Streak Counter */}
            <StreakCounter streak={streak} />

            {/* Goals Progress */}
            <GoalsProgress
              goals={goals}
              savings={summary.savings}
              onAddGoal={addGoal}
              onUpdateGoal={updateGoal}
            />
          </div>

          {/* Middle Column - Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm onAddTransaction={addTransaction} />
          </div>

          {/* Right Column - Transaction List */}
          <div className="lg:col-span-1">
            <TransactionList
              transactions={transactions}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-card/30 border border-border/30">
            <div className="text-2xl font-bold text-primary">{transactions.length}</div>
            <div className="text-sm text-muted-foreground">Total Transactions</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-card/30 border border-border/30">
            <div className="text-2xl font-bold text-savings">{goals.length}</div>
            <div className="text-sm text-muted-foreground">Active Goals</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-card/30 border border-border/30">
            <div className="text-2xl font-bold text-income">
              {transactions.filter(t => t.type === 'income').length}
            </div>
            <div className="text-sm text-muted-foreground">Income Entries</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-card/30 border border-border/30">
            <div className="text-2xl font-bold text-expense">
              {transactions.filter(t => t.type === 'expense').length}
            </div>
            <div className="text-sm text-muted-foreground">Expense Entries</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
