import { useState, useCallback, useRef } from 'react';

const DOLLY_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const DOLLY_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

export type ConnectionType = 'bluetooth' | 'wifi' | 'demo';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface UseDeviceConnectionReturn {
  status: ConnectionStatus;
  connectionType: ConnectionType | null;
  connect: (type: ConnectionType, wifiIp?: string) => Promise<void>;
  disconnect: () => void;
  sendCommand: (command: string) => Promise<void>;
}

export const useDeviceConnection = (): UseDeviceConnectionReturn => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionType, setConnectionType] = useState<ConnectionType | null>(null);
  
  // Bluetooth refs
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  
  // WiFi refs
  const wsRef = useRef<WebSocket | null>(null);

  const connectBluetooth = useCallback(async () => {
    try {
      setStatus('connecting');
      
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'Dolly-ESP32' }],
        optionalServices: [DOLLY_SERVICE_UUID]
      });

      deviceRef.current = device;

      device.addEventListener('gattserverdisconnected', () => {
        setStatus('disconnected');
        setConnectionType(null);
        characteristicRef.current = null;
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      const service = await server.getPrimaryService(DOLLY_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(DOLLY_CHARACTERISTIC_UUID);
      
      characteristicRef.current = characteristic;
      setStatus('connected');
      setConnectionType('bluetooth');
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      setStatus('disconnected');
      setConnectionType(null);
      throw error;
    }
  }, []);

  const connectWiFi = useCallback(async (ip: string) => {
    try {
      setStatus('connecting');
      
      // Connect via WebSocket to ESP32
      const ws = new WebSocket(`ws://${ip}:81`);
      
      ws.onopen = () => {
        console.log('WiFi WebSocket connected');
        setStatus('connected');
        setConnectionType('wifi');
      };

      ws.onerror = (error) => {
        console.error('WiFi WebSocket error:', error);
        setStatus('disconnected');
        setConnectionType(null);
      };

      ws.onclose = () => {
        console.log('WiFi WebSocket disconnected');
        setStatus('disconnected');
        setConnectionType(null);
        wsRef.current = null;
      };

      wsRef.current = ws;

      // Wait for connection or timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('Connection timeout'));
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          setStatus('connected');
          setConnectionType('wifi');
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Connection failed'));
        };
      });
    } catch (error) {
      console.error('WiFi connection error:', error);
      setStatus('disconnected');
      setConnectionType(null);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      throw error;
    }
  }, []);

  const connect = useCallback(async (type: ConnectionType, wifiIp?: string) => {
    if (type === 'demo') {
      setStatus('connected');
      setConnectionType('demo');
      console.log('[MODE DÉMO] Activé');
      return;
    }

    if (type === 'bluetooth') {
      await connectBluetooth();
    } else if (type === 'wifi') {
      if (!wifiIp) {
        throw new Error('IP address required for WiFi connection');
      }
      await connectWiFi(wifiIp);
    }
  }, [connectBluetooth, connectWiFi]);

  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    deviceRef.current = null;
    characteristicRef.current = null;
    wsRef.current = null;
    setStatus('disconnected');
    setConnectionType(null);
  }, []);

  const sendCommand = useCallback(async (command: string) => {
    if (connectionType === 'demo') {
      console.log(`[MODE DÉMO] Command sent: ${command}`);
      return;
    }

    if (connectionType === 'bluetooth') {
      if (!characteristicRef.current) {
        throw new Error('Not connected via Bluetooth');
      }
      try {
        const encoder = new TextEncoder();
        await characteristicRef.current.writeValue(encoder.encode(command));
        console.log(`[Bluetooth] Command sent: ${command}`);
      } catch (error) {
        console.error('Error sending Bluetooth command:', error);
        throw error;
      }
    } else if (connectionType === 'wifi') {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        throw new Error('Not connected via WiFi');
      }
      try {
        wsRef.current.send(command);
        console.log(`[WiFi] Command sent: ${command}`);
      } catch (error) {
        console.error('Error sending WiFi command:', error);
        throw error;
      }
    }
  }, [connectionType]);

  return {
    status,
    connectionType,
    connect,
    disconnect,
    sendCommand
  };
};
