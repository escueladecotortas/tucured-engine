// Archivo: src/components/ui/Toast.jsx
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 z-[200] flex items-center gap-3 p-4 rounded-xl border ${bgColor} ${borderColor} ${textColor} shadow-lg animate-in slide-in-from-right-full duration-300`}>
      <Icon size={20} className={type === 'success' ? 'text-green-500' : 'text-red-500'} />
      <div className="flex flex-col">
        <p className="text-[11px] font-black uppercase tracking-widest font-mono">
          {type === 'success' ? 'Éxito' : 'Error'}
        </p>
        <p className="text-[13px] font-serif italic font-medium">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
