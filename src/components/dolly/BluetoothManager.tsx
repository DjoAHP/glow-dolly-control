import { Button } from '@/components/ui/button';
import { Bluetooth, FlaskConical } from 'lucide-react';
import { ConnectionStatus as Status } from '@/hooks/useBluetooth';
import { toast } from 'sonner';

interface BluetoothManagerProps {
  status: Status;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onEnableDemo: () => void;
}

export const BluetoothManager = ({ 
  status, 
  onConnect, 
  onDisconnect,
  onEnableDemo 
}: BluetoothManagerProps) => {
  const handleConnect = async () => {
    try {
      await onConnect();
      toast.success('Connexion établie avec succès');
    } catch (error) {
      toast.error('Échec de la connexion Bluetooth');
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    toast.info('Déconnecté du périphérique');
  };

  const handleDemoMode = () => {
    onEnableDemo();
    toast.info('Mode démo activé');
  };

  const isConnected = status === 'connected' || status === 'demo';

  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-primary">Connexion Bluetooth</h2>
      
      <div className="flex gap-3">
        {!isConnected ? (
          <>
            <Button 
              onClick={handleConnect}
              disabled={status === 'connecting'}
              className="flex-1 bg-primary/10 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 glow-cyan"
            >
              <Bluetooth className="mr-2 h-5 w-5" />
              {status === 'connecting' ? 'Connexion...' : 'Connecter ESP32'}
            </Button>
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
            >
              <FlaskConical className="mr-2 h-4 w-4" />
              Mode Démo
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleDisconnect}
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/20"
          >
            Déconnecter
          </Button>
        )}
      </div>
    </div>
  );
};
