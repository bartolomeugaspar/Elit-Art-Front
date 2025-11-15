'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const bgColor = {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500',
    error: 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500',
    info: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500',
  }[toast.type];

  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    info: 'text-blue-700',
  }[toast.type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle,
  }[toast.type];

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }[toast.type];

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border ${bgColor} ${
        isExiting ? 'animate-out fade-out slide-out-to-right-full duration-300' : 'animate-in fade-in slide-in-from-bottom-5 duration-300'
      }`}
    >
      <div className="flex-shrink-0">
        <Icon size={20} className={`${iconColor} animate-bounce`} />
      </div>
      <div className="flex-1">
        <p className={`${textColor} text-sm font-bold`}>{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
