import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  isMoving: boolean;
  remainingTime?: number;
}

export const ProgressIndicator = ({ 
  progress, 
  isMoving,
  remainingTime 
}: ProgressIndicatorProps) => {
  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Progression</h2>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary">
            {remainingTime !== undefined ? `${remainingTime}s` : `${Math.round(progress)}%`}
          </span>
        </div>
      </div>

      <div className="relative">
        <Progress value={progress} className="h-3" />
        {isMoving && (
          <div className="absolute inset-0 shimmer rounded-full pointer-events-none" />
        )}
      </div>
    </div>
  );
};
