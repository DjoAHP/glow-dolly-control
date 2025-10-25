import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bluetooth, Wifi, FlaskConical } from 'lucide-react';
import { ConnectionStatus, ConnectionType } from '@/hooks/useDeviceConnection';
import { toast } from 'sonner';

interface ConnectionManagerProps {
  status: ConnectionStatus;
  connectionType: ConnectionType | null;
  onConnect: (type: ConnectionType, wifiIp?: string) => Promise<void>;
  onDisconnect: () => void;
}

export const ConnectionManager = ({ 
  status, 
  connectionType,
  onConnect, 
  onDisconnect 
}: ConnectionManagerProps) => {
  const [wifiIp, setWifiIp] = useState('192.168.4.1');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (type: ConnectionType) => {
    setIsConnecting(true);
    try {
      if (type === 'wifi') {
        await onConnect(type, wifiIp);
        toast.success('Connecté via WiFi');
      } else if (type === 'bluetooth') {
        await onConnect(type);
        toast.success('Connecté via Bluetooth');
      } else {
        await onConnect(type);
        toast.success('Mode démo activé');
      }
    } catch (error) {
      toast.error(`Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    toast.info('Déconnecté');
  };

  if (status === 'connected') {
    return (
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {connectionType === 'bluetooth' && <Bluetooth className="w-5 h-5 text-primary" />}
            {connectionType === 'wifi' && <Wifi className="w-5 h-5 text-primary" />}
            {connectionType === 'demo' && <FlaskConical className="w-5 h-5 text-primary" />}
            <span className="font-semibold">
              Connecté via {connectionType === 'bluetooth' ? 'Bluetooth' : connectionType === 'wifi' ? 'WiFi' : 'Mode Démo'}
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="glow-cyan"
          >
            Déconnecter
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <Tabs defaultValue="bluetooth" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="bluetooth" className="flex items-center gap-2">
            <Bluetooth className="w-4 h-4" />
            <span className="hidden sm:inline">Bluetooth</span>
          </TabsTrigger>
          <TabsTrigger value="wifi" className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="hidden sm:inline">WiFi</span>
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            <span className="hidden sm:inline">Démo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bluetooth" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connectez-vous à votre Dolly-ESP32 via Bluetooth Low Energy
          </p>
          <Button 
            onClick={() => handleConnect('bluetooth')}
            disabled={isConnecting}
            className="w-full glow-cyan"
          >
            {isConnecting ? 'Connexion...' : 'Connecter Bluetooth'}
          </Button>
        </TabsContent>

        <TabsContent value="wifi" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wifi-ip">Adresse IP de l'ESP32</Label>
            <Input
              id="wifi-ip"
              type="text"
              value={wifiIp}
              onChange={(e) => setWifiIp(e.target.value)}
              placeholder="192.168.4.1"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              L'ESP32 doit être sur le même réseau WiFi ou en mode point d'accès
            </p>
          </div>
          <Button 
            onClick={() => handleConnect('wifi')}
            disabled={isConnecting || !wifiIp}
            className="w-full glow-cyan"
          >
            {isConnecting ? 'Connexion...' : 'Connecter WiFi'}
          </Button>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Testez l'interface sans connexion réelle au dolly
          </p>
          <Button 
            onClick={() => handleConnect('demo')}
            disabled={isConnecting}
            className="w-full glow-purple"
          >
            Activer Mode Démo
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
