import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface DirectionControlsProps {
  isMoving: boolean;
  direction: 'forward' | 'reverse' | null;
  onForward: () => void;
  onReverse: () => void;
  onTogglePlay: () => void;
  disabled?: boolean;
}

export const DirectionControls = ({
  isMoving,
  direction,
  onForward,
  onReverse,
  onTogglePlay,
  disabled = false
}: DirectionControlsProps) => {
  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-primary">Direction</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={onReverse}
          disabled={disabled}
          className={`h-20 transition-all duration-300 ${
            direction === 'reverse' && isMoving
              ? 'bg-primary/20 border-2 border-primary text-primary glow-cyan'
              : 'bg-card/60 border border-border hover:bg-card'
          }`}
        >
          <ChevronLeft className={`h-8 w-8 ${direction === 'reverse' && isMoving ? 'text-primary' : ''}`} />
        </Button>

        <Button
          onClick={onTogglePlay}
          disabled={disabled}
          variant="ghost"
          className="h-20 opacity-60 hover:opacity-100 transition-opacity"
        >
          {isMoving ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <Button
          onClick={onForward}
          disabled={disabled}
          className={`h-20 transition-all duration-300 ${
            direction === 'forward' && isMoving
              ? 'bg-primary/20 border-2 border-primary text-primary glow-cyan'
              : 'bg-card/60 border border-border hover:bg-card'
          }`}
        >
          <ChevronRight className={`h-8 w-8 ${direction === 'forward' && isMoving ? 'text-primary' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
