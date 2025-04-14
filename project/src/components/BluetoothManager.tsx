import React, { useCallback } from 'react';
import { Bluetooth, X } from 'lucide-react';
import { useStore } from '../store';

export const BluetoothManager: React.FC = () => {
  const { device, setDevice } = useStore();

  const connectBluetooth = useCallback(async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }],
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      const characteristic = await service?.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

      setDevice({ id: device.id, name: device.name || 'Unknown Device', connected: true });

      characteristic?.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (value) {
          const data = new Uint8Array(value.buffer);
          // Process the incoming data and update sensors
          // Format: [sensor_id, value_high, value_low]
          const sensorId = data[0];
          const value = (data[1] << 8) | data[2];
          useStore.getState().updateSensor(sensorId, value * (5 / 1023)); // Convert to voltage
        }
      });

      await characteristic?.startNotifications();
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
    }
  }, [setDevice]);

  const disconnect = useCallback(() => {
    setDevice(null);
  }, [setDevice]);

  return (
    <div className="fixed bottom-4 right-4">
      {device ? (
        <button
          onClick={disconnect}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-5 h-5" />
          Disconnect {device.name}
        </button>
      ) : (
        <button
          onClick={connectBluetooth}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Bluetooth className="w-5 h-5" />
          Connect Device
        </button>
      )}
    </div>
  );
};