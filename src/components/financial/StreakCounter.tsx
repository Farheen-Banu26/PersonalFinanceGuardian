import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter = ({ streak }: StreakCounterProps) => {
  const getStreakLevel = (streakCount: number) => {
    if (streakCount >= 30) return { level: 'Fire', color: 'text-red-500', emoji: '🔥' };
    if (streakCount >= 14) return { level: 'Hot', color: 'text-orange-500', emoji: '🌟' };
    if (streakCount >= 7) return { level: 'Warm', color: 'text-yellow-500', emoji: '⚡' };
    if (streakCount >= 3) return { level: 'Started', color: 'text-blue-500', emoji: '💪' };
    return { level: 'Beginning', color: 'text-gray-500', emoji: '🌱' };
  };

  const streakInfo = getStreakLevel(streak);

  return (
    <Card className="financial-card group hover:scale-105 transition-transform cursor-pointer">
      <div className="text-center space-y-3">
        <div className="text-3xl animate-bounce-gentle">
          <Flame className={`h-8 w-8 mx-auto ${streakInfo.color}`} />
        </div>
        
        <div>
          <div className="text-3xl font-bold text-primary mb-1 animate-counter">
            {streak}
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Day Streak
          </p>
        </div>
        
        <Badge variant="outline" className={`${streakInfo.color} border-current`}>
          <span className="mr-1">{streakInfo.emoji}</span>
          {streakInfo.level}
        </Badge>
        
        <div className="text-xs text-muted-foreground">
          {streak === 0 
            ? "Add your first expense to start your streak!" 
            : streak === 1 
            ? "Great start! Keep logging daily."
            : `Amazing! ${streak} days of consistent tracking.`
          }
        </div>
      </div>
    </Card>
  );
};