import { useState, useEffect } from 'react';
import { Transaction, Goal, FinancialSummary } from '@/types/financial';

const STORAGE_KEYS = {
  TRANSACTIONS: 'financial_transactions',
  GOALS: 'financial_goals',
  STREAK: 'financial_streak',
  LAST_TRANSACTION_DATE: 'last_transaction_date',
};

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
    const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
  }, [streak]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update streak for expenses
    if (transaction.type === 'expense') {
      updateStreak();
    }
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updatedGoal: Partial<Goal>) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, ...updatedGoal } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastTransactionDate = localStorage.getItem(STORAGE_KEYS.LAST_TRANSACTION_DATE);
    
    if (lastTransactionDate !== today) {
      setStreak(prev => prev + 1);
      localStorage.setItem(STORAGE_KEYS.LAST_TRANSACTION_DATE, today);
    }
  };

  const getFinancialSummary = (): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savings = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      savings,
      streak,
    };
  };

  return {
    transactions,
    goals,
    streak,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    getFinancialSummary,
  };
};