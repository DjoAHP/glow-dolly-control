import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface EmergencyStopProps {
  onStop: () => void;
  disabled?: boolean;
}

export const EmergencyStop = ({ onStop, disabled = false }: EmergencyStopProps) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <Button
        onClick={onStop}
        disabled={disabled}
        className="w-full h-20 bg-destructive/20 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground glow-red animate-pulse-glow transition-all duration-300 text-xl font-bold"
      >
        <AlertCircle className="mr-3 h-8 w-8" />
        ARRÊT D'URGENCE
      </Button>
    </div>
  );
};
