'use client';

import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancelar',
  onConfirm,
  showCancel = false,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
  };

  const borderColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500',
  };

  const buttonColors = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        {/* Header com ícone */}
        <div className={`flex flex-col items-center pt-8 pb-4 border-t-4 ${borderColors[type]} rounded-t-xl`}>
          {icons[type]}
          {title && (
            <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Message */}
        <div className="px-8 py-4">
          <p className="text-gray-600 text-center whitespace-pre-line">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 py-6 bg-gray-50 rounded-b-xl">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${buttonColors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useModal() {
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type: ModalType;
    onConfirm?: () => void;
    showCancel?: boolean;
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const showModal = (
    message: string,
    options?: {
      title?: string;
      type?: ModalType;
      onConfirm?: () => void;
      showCancel?: boolean;
    }
  ) => {
    setModalState({
      isOpen: true,
      message,
      title: options?.title,
      type: options?.type || 'info',
      onConfirm: options?.onConfirm,
      showCancel: options?.showCancel || false,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    ...modalState,
    showModal,
    closeModal,
  };
}
