import { useState, useEffect, useCallback } from 'react';
import { useDeviceConnection } from '@/hooks/useDeviceConnection';
import { ConnectionManager } from '@/components/dolly/ConnectionManager';
import { ConnectionStatus } from '@/components/dolly/ConnectionStatus';
import { DirectionControls } from '@/components/dolly/DirectionControls';
import { SpeedControl } from '@/components/dolly/SpeedControl';
import { ProgressIndicator } from '@/components/dolly/ProgressIndicator';
import { DurationControl } from '@/components/dolly/DurationControl';
import { PresetManager, Preset } from '@/components/dolly/PresetManager';
import { EmergencyStop } from '@/components/dolly/EmergencyStop';
import { toast } from 'sonner';

const STORAGE_KEY = 'dolly-presets';

export default function DollyController() {
  const { status, connectionType, connect, disconnect, sendCommand } = useDeviceConnection();
  
  const [speed, setSpeed] = useState(50);
  const [direction, setDirection] = useState<'forward' | 'reverse' | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [durationEnabled, setDurationEnabled] = useState(false);
  const [duration, setDuration] = useState(30);
  const [remainingTime, setRemainingTime] = useState<number | undefined>();
  const [presets, setPresets] = useState<Preset[]>([]);

  // Load presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load presets', e);
      }
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  // Timer and progress management
  useEffect(() => {
    if (!isMoving) {
      setProgress(0);
      setRemainingTime(undefined);
      return;
    }

    if (durationEnabled) {
      setRemainingTime(duration);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        const prog = Math.min(100, (elapsed / duration) * 100);
        
        setProgress(prog);
        setRemainingTime(Math.ceil(remaining));

        if (remaining <= 0) {
          handleStop();
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
      // Continuous mode - simulate progress
      const interval = setInterval(() => {
        setProgress(prev => (prev + 0.5) % 100);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isMoving, durationEnabled, duration]);

  const handleSendCommand = useCallback(async (cmd: string) => {
    try {
      await sendCommand(cmd);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la commande');
    }
  }, [sendCommand]);

  const handleForward = async () => {
    setDirection('forward');
    setIsMoving(true);
    await handleSendCommand(`DIR:FWD`);
    await handleSendCommand(`SPEED:${speed}`);
  };

  const handleReverse = async () => {
    setDirection('reverse');
    setIsMoving(true);
    await handleSendCommand(`DIR:REV`);
    await handleSendCommand(`SPEED:${speed}`);
  };

  const handleTogglePlay = () => {
    if (isMoving) {
      handleStop();
    } else if (direction) {
      setIsMoving(true);
      if (direction === 'forward') {
        handleSendCommand(`DIR:FWD`);
      } else {
        handleSendCommand(`DIR:REV`);
      }
      handleSendCommand(`SPEED:${speed}`);
    }
  };

  const handleStop = async () => {
    setIsMoving(false);
    setDirection(null);
    await handleSendCommand('STOP');
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isMoving) {
      await handleSendCommand(`SPEED:${newSpeed}`);
    }
  };

  const handleAddPreset = (preset: Omit<Preset, 'id'>) => {
    const newPreset = {
      ...preset,
      id: Date.now().toString()
    };
    setPresets([...presets, newPreset]);
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  const handleApplyPreset = async (preset: Preset) => {
    setSpeed(preset.speed);
    setDirection(preset.direction);
    setDurationEnabled(true);
    setDuration(preset.duration);
    setIsMoving(true);
    
    await handleSendCommand(`DIR:${preset.direction === 'forward' ? 'FWD' : 'REV'}`);
    await handleSendCommand(`SPEED:${preset.speed}`);
    toast.success(`Preset "${preset.name}" appliqué`);
  };

  const isConnected = status === 'connected';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dolly Control
          </h1>
          <p className="text-muted-foreground">Contrôle motorisé professionnel</p>
        </header>

        <div className="space-y-6">
          <ConnectionStatus status={status} connectionType={connectionType} />
          
          <ConnectionManager
            status={status}
            connectionType={connectionType}
            onConnect={connect}
            onDisconnect={disconnect}
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <DirectionControls
                isMoving={isMoving}
                direction={direction}
                onForward={handleForward}
                onReverse={handleReverse}
                onTogglePlay={handleTogglePlay}
                disabled={!isConnected}
              />

              <SpeedControl
                speed={speed}
                onSpeedChange={handleSpeedChange}
                disabled={!isConnected}
              />

              <DurationControl
                enabled={durationEnabled}
                duration={duration}
                onEnabledChange={setDurationEnabled}
                onDurationChange={setDuration}
                disabled={!isConnected}
              />
            </div>

            <div className="space-y-6">
              <ProgressIndicator
                progress={progress}
                isMoving={isMoving}
                remainingTime={remainingTime}
              />

              <PresetManager
                presets={presets}
                onApplyPreset={handleApplyPreset}
                onAddPreset={handleAddPreset}
                onDeletePreset={handleDeletePreset}
                disabled={!isConnected}
              />

              <EmergencyStop
                onStop={handleStop}
                disabled={!isConnected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
