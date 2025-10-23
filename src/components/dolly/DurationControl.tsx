import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer } from 'lucide-react';

interface DurationControlProps {
  enabled: boolean;
  duration: number;
  onEnabledChange: (enabled: boolean) => void;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
}

export const DurationControl = ({
  enabled,
  duration,
  onEnabledChange,
  onDurationChange,
  disabled = false
}: DurationControlProps) => {
  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Durée limitée</h2>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          disabled={disabled}
        />
      </div>

      {enabled && (
        <div className="space-y-2">
          <Label htmlFor="duration" className="flex items-center gap-2 text-muted-foreground">
            <Timer className="h-4 w-4" />
            Durée (secondes)
          </Label>
          <Input
            id="duration"
            type="number"
            min={1}
            max={300}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            disabled={disabled}
            className="bg-input border-border focus:border-primary"
          />
        </div>
      )}
    </div>
  );
};
