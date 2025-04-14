import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2,
  Download,
  Gauge,
  Bell,
  Palette,
  Save,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../store';
import { downloadJson } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const sensorTypes = [
  { value: 'voltage', label: 'Voltage' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'default', label: 'Generic' },
];

export const SettingsDialog: React.FC = () => {
  const { sensors, settings, updateSettings, addToast } = useStore();
  const theme = settings.theme;

  const handleExport = () => {
    const data = {
      sensors,
      settings,
      exportDate: new Date().toISOString(),
    };
    downloadJson(data, 'arduino-sensor-data.json');
    addToast({
      title: 'Data Exported',
      description: 'Sensor data and settings have been exported successfully.',
      type: 'success',
    });
  };

  const handleReset = () => {
    updateSettings({
      sensorNames: {},
      sensorUnits: {},
      sensorTypes: {},
      sensorThresholds: {},
      chartUpdateInterval: 1000,
      dataRetentionDays: 7,
      theme: 'light',
      notifications: true,
    });
    addToast({
      title: 'Settings Reset',
      description: 'All settings have been reset to default values.',
      type: 'info',
    });
  };

  const handleClearHistory = () => {
    addToast({
      title: 'History Cleared',
      description: 'Sensor history has been cleared successfully.',
      type: 'success',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
          <Settings2 className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[600px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Dashboard Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="sensors" className="mt-4">
          <TabsList className={`grid grid-cols-3 gap-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-1 rounded-lg`}>
            <TabsTrigger value="sensors" className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Sensors
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sensors" className="mt-4 space-y-6">
            <div className="space-y-4">
              {sensors.map((sensor) => (
                <motion.div
                  key={sensor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4 p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}
                >
                  <input
                    type="text"
                    value={settings.sensorNames[sensor.id] || sensor.name}
                    onChange={(e) =>
                      updateSettings({
                        sensorNames: {
                          ...settings.sensorNames,
                          [sensor.id]: e.target.value,
                        },
                      })
                    }
                    className={`px-3 py-2 border rounded-lg w-full ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder={`Sensor ${sensor.id + 1} Name`}
                  />
                  <input
                    type="text"
                    value={settings.sensorUnits[sensor.id] || sensor.unit}
                    onChange={(e) =>
                      updateSettings({
                        sensorUnits: {
                          ...settings.sensorUnits,
                          [sensor.id]: e.target.value,
                        },
                      })
                    }
                    className={`px-3 py-2 border rounded-lg w-full ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="Unit"
                  />
                  <Select
                    value={settings.sensorTypes[sensor.id] || 'default'}
                    onValueChange={(value) =>
                      updateSettings({
                        sensorTypes: {
                          ...settings.sensorTypes,
                          [sensor.id]: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensorTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="number"
                    value={settings.sensorThresholds[sensor.id] || sensor.max * 0.8}
                    onChange={(e) =>
                      updateSettings({
                        sensorThresholds: {
                          ...settings.sensorThresholds,
                          [sensor.id]: parseFloat(e.target.value),
                        },
                      })
                    }
                    className={`px-3 py-2 border rounded-lg w-full ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="Threshold"
                    step="0.1"
                  />
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Update Interval (ms)</Label>
                <input
                  type="number"
                  value={settings.chartUpdateInterval}
                  onChange={(e) =>
                    updateSettings({
                      chartUpdateInterval: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  min="100"
                  step="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Data Retention (days)</Label>
                <input
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) =>
                    updateSettings({
                      dataRetentionDays: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  min="1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch
                  checked={settings.theme === 'dark'}
                  onCheckedChange={(checked) =>
                    updateSettings({ theme: checked ? 'dark' : 'light' })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Compact View</Label>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) =>
                    updateSettings({ compactView: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Notifications</Label>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Receive alerts when sensors exceed thresholds
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: checked })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Settings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};