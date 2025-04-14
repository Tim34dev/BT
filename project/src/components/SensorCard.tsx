import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Activity, AlertTriangle, Battery, Thermometer, Droplets } from 'lucide-react';
import type { SensorData } from '../types';
import { useStore } from '../store';
import { format } from 'date-fns';

const sensorIcons = {
  voltage: Battery,
  temperature: Thermometer,
  humidity: Droplets,
  default: Activity,
};

interface Props {
  sensor: SensorData;
}

export const SensorCard: React.FC<Props> = ({ sensor }) => {
  const settings = useStore((state) => state.settings);
  const name = settings.sensorNames[sensor.id] || sensor.name;
  const unit = settings.sensorUnits[sensor.id] || sensor.unit;
  const type = settings.sensorTypes[sensor.id] || 'default';
  const threshold = settings.sensorThresholds[sensor.id] || sensor.max * 0.8;

  const Icon = sensorIcons[type as keyof typeof sensorIcons] || sensorIcons.default;
  const isOverThreshold = sensor.value > threshold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-l-4 ${
        isOverThreshold ? 'border-red-500' : 'border-blue-500'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${isOverThreshold ? 'text-red-500' : 'text-blue-500'}`} />
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold">
            {sensor.value.toFixed(2)}
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </span>
          {isOverThreshold && (
            <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
              <AlertTriangle className="w-3 h-3" />
              Above threshold
            </div>
          )}
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensor.history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <YAxis
              domain={[sensor.min, sensor.max]}
              width={30}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value.toFixed(2)}${unit}`, name]}
              labelFormatter={(timestamp) => format(timestamp, 'HH:mm:ss')}
            />
            <ReferenceLine
              y={threshold}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{
                value: 'Threshold',
                position: 'right',
                fill: '#ef4444',
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isOverThreshold ? '#ef4444' : '#3b82f6'}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div className="space-y-1">
          <div className="text-gray-500">Min: {sensor.min.toFixed(1)}{unit}</div>
          <div className="text-gray-500">Max: {sensor.max.toFixed(1)}{unit}</div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-gray-500">Threshold: {threshold.toFixed(1)}{unit}</div>
          <div className="text-gray-500">
            Avg: {(sensor.history.reduce((acc, curr) => acc + curr.value, 0) / sensor.history.length).toFixed(1)}{unit}
          </div>
        </div>
      </div>
    </motion.div>
  );
};