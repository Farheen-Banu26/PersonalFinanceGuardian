export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  streak: number;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export const expenseCategories: Category[] = [
  { name: 'Food', icon: '🍔', color: 'hsl(var(--warning))' },
  { name: 'Transportation', icon: '🚗', color: 'hsl(var(--savings))' },
  { name: 'Entertainment', icon: '🎬', color: 'hsl(var(--primary))' },
  { name: 'Shopping', icon: '🛍️', color: 'hsl(var(--accent))' },
  { name: 'Bills', icon: '📄', color: 'hsl(var(--expense))' },
  { name: 'Healthcare', icon: '🏥', color: 'hsl(var(--destructive))' },
  { name: 'Other', icon: '📝', color: 'hsl(var(--muted))' },
];

export const incomeCategories: Category[] = [
  { name: 'Salary', icon: '💼', color: 'hsl(var(--income))' },
  { name: 'Freelance', icon: '💻', color: 'hsl(var(--primary))' },
  { name: 'Investment', icon: '📈', color: 'hsl(var(--savings))' },
  { name: 'Gift', icon: '🎁', color: 'hsl(var(--warning))' },
  { name: 'Other', icon: '💰', color: 'hsl(var(--success))' },
];