import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FinancialCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant: 'income' | 'expense' | 'savings';
  className?: string;
}

export const FinancialCard = ({ 
  title, 
  amount, 
  icon, 
  trend, 
  variant, 
  className 
}: FinancialCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(value));
  };

  const cardClass = cn(
    'financial-card',
    {
      'financial-card-income': variant === 'income',
      'financial-card-expense': variant === 'expense',
      'financial-card-savings': variant === 'savings',
    },
    className
  );

  return (
    <Card className={cardClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            variant === 'income' && "bg-income/20 text-income",
            variant === 'expense' && "bg-expense/20 text-expense",
            variant === 'savings' && "bg-savings/20 text-savings"
          )}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn(
              "text-2xl font-bold animate-counter",
              variant === 'income' && "text-income",
              variant === 'expense' && "text-expense",
              variant === 'savings' && amount >= 0 ? "text-savings" : "text-expense"
            )}>
              {variant === 'expense' ? '-' : ''}{formatCurrency(amount)}
            </p>
          </div>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};