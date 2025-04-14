import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from './store';
import { SensorCard } from './components/SensorCard';
import { BluetoothManager } from './components/BluetoothManager';
import { SettingsDialog } from './components/SettingsDialog';
import { ToastContainer } from './components/Toast';

function App() {
  const sensors = useStore((state) => state.sensors);
  const device = useStore((state) => state.device);
  const theme = useStore((state) => state.settings.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm shadow-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-transparent bg-clip-text`}
            >
              Arduino Sensor Dashboard
            </motion.h1>
            {device && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-sm px-3 py-1.5 ${theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'} rounded-full font-medium flex items-center gap-1.5`}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Connected to {device.name}
              </motion.span>
            )}
          </div>
          <SettingsDialog />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sensors.map((sensor, index) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SensorCard sensor={sensor} />
            </motion.div>
          ))}
        </div>
      </main>

      <BluetoothManager />
      <ToastContainer />
    </div>
  );
}

export default App;