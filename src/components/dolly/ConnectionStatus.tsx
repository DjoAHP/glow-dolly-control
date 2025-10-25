import { Bluetooth, WifiOff, FlaskConical } from 'lucide-react';
import { ConnectionStatus as Status } from '@/hooks/useBluetooth';

interface ConnectionStatusProps {
  status: Status;
}

export const ConnectionStatus = ({ status }: ConnectionStatusProps) => {
  const getStatusConfig = () => {
    if (status === 'connected') {
      return {
        icon: Bluetooth,
        text: 'Connecté (Bluetooth)',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/50',
        glowClass: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]'
      };
    }
    
    if (status === 'demo') {
      return {
        icon: FlaskConical,
        text: 'Mode Démo',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/50',
        glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]'
      };
    }
    
    if (status === 'connecting') {
      return {
        icon: Bluetooth,
        text: 'Connexion...',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        glowClass: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]'
      };
    }
    
    return {
      icon: WifiOff,
      text: 'Déconnecté',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      glowClass: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.glowClass} transition-all duration-300`}>
      <Icon className={`w-5 h-5 ${config.color}`} />
      <span className={`font-semibold ${config.color}`}>{config.text}</span>
      {status === 'connecting' && (
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>
      )}
    </div>
  );
};
