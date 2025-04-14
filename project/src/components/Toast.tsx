import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useStore } from '../store';
import type { Toast as ToastType } from '../types';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const removeToast = useStore((state) => state.removeToast);
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${colors[toast.type]} border rounded-lg shadow-lg p-4 flex items-start gap-3 w-full max-w-sm`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="font-medium">{toast.title}</h3>
        {toast.description && (
          <p className="text-sm mt-1 opacity-90">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};