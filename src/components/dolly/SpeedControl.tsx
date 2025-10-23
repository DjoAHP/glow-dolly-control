import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Gauge } from 'lucide-react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const SPEED_PRESETS = [
  { label: 'Lente', value: 30 },
  { label: 'Moyenne', value: 60 },
  { label: 'Rapide', value: 90 }
];

export const SpeedControl = ({ speed, onSpeedChange, disabled = false }: SpeedControlProps) => {
  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Vitesse</h2>
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-primary">{speed}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <Slider
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          max={100}
          min={0}
          step={1}
          disabled={disabled}
          className="cursor-pointer"
        />
        <div className="h-1 rounded-full bg-gradient-to-r from-primary/30 via-primary to-secondary -mt-3 pointer-events-none" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SPEED_PRESETS.map((preset) => (
          <Button
            key={preset.label}
            onClick={() => onSpeedChange(preset.value)}
            disabled={disabled}
            variant="outline"
            className={`transition-all duration-300 ${
              speed === preset.value
                ? 'bg-primary/20 border-primary text-primary glow-cyan'
                : 'border-border hover:bg-card'
            }`}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
