import { useState, useCallback, useRef } from 'react';

const DOLLY_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const DOLLY_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'demo';

interface UseBluetoothReturn {
  status: ConnectionStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendCommand: (command: string) => Promise<void>;
  enableDemoMode: () => void;
}

export const useBluetooth = (): UseBluetoothReturn => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const connect = useCallback(async () => {
    try {
      setStatus('connecting');
      
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'Dolly-ESP32' }],
        optionalServices: [DOLLY_SERVICE_UUID]
      });

      deviceRef.current = device;

      device.addEventListener('gattserverdisconnected', () => {
        setStatus('disconnected');
        characteristicRef.current = null;
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      const service = await server.getPrimaryService(DOLLY_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(DOLLY_CHARACTERISTIC_UUID);
      
      characteristicRef.current = characteristic;
      setStatus('connected');
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      setStatus('disconnected');
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    deviceRef.current = null;
    characteristicRef.current = null;
    setStatus('disconnected');
  }, []);

  const sendCommand = useCallback(async (command: string) => {
    if (status === 'demo') {
      console.log(`[MODE DÉMO] Command sent: ${command}`);
      return;
    }

    if (!characteristicRef.current) {
      throw new Error('Not connected to device');
    }

    try {
      const encoder = new TextEncoder();
      await characteristicRef.current.writeValue(encoder.encode(command));
      console.log(`Command sent: ${command}`);
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }, [status]);

  const enableDemoMode = useCallback(() => {
    setStatus('demo');
    console.log('[MODE DÉMO] Activé');
  }, []);

  return {
    status,
    connect,
    disconnect,
    sendCommand,
    enableDemoMode
  };
};
