export interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  history: { timestamp: number; value: number }[];
}

export interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
}

export interface Settings {
  sensorNames: Record<number, string>;
  sensorUnits: Record<number, string>;
  sensorTypes: Record<number, string>;
  sensorThresholds: Record<number, number>;
  chartUpdateInterval: number;
  dataRetentionDays: number;
  theme: 'light' | 'dark';
  notifications: boolean;
  compactView: boolean;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}