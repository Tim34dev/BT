import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SensorData, BluetoothDevice, Settings, Toast } from './types';

interface State {
  sensors: SensorData[];
  device: BluetoothDevice | null;
  settings: Settings;
  toasts: Toast[];
  updateSensor: (id: number, value: number) => void;
  setDevice: (device: BluetoothDevice | null) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const initialSensors: SensorData[] = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  name: `Sensor ${i + 1}`,
  value: 0,
  unit: 'V',
  min: 0,
  max: 5,
  history: [],
}));

export const useStore = create<State>()(
  persist(
    (set) => ({
      sensors: initialSensors,
      device: null,
      toasts: [],
      settings: {
        sensorNames: {},
        sensorUnits: {},
        sensorTypes: {},
        sensorThresholds: {},
        chartUpdateInterval: 1000,
        dataRetentionDays: 7,
        theme: 'light',
        notifications: true,
      },
      updateSensor: (id, value) =>
        set((state) => {
          const sensor = state.sensors.find((s) => s.id === id);
          if (sensor) {
            const threshold = state.settings.sensorThresholds[id] || sensor.max * 0.8;
            if (value > threshold && state.settings.notifications) {
              const toastId = `threshold-${id}-${Date.now()}`;
              if (!state.toasts.some((t) => t.id.startsWith(`threshold-${id}`))) {
                state.addToast({
                  title: `${state.settings.sensorNames[id] || sensor.name} Alert`,
                  description: `Value ${value.toFixed(2)} exceeds threshold ${threshold.toFixed(2)}`,
                  type: 'warning',
                });
              }
            }
          }

          return {
            sensors: state.sensors.map((sensor) =>
              sensor.id === id
                ? {
                    ...sensor,
                    value,
                    history: [
                      ...sensor.history,
                      { timestamp: Date.now(), value },
                    ].slice(-100),
                  }
                : sensor
            ),
          };
        }),
      setDevice: (device) => set({ device }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'arduino-dashboard',
    }
  )
);