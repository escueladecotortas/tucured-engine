// Archivo: src/components/ui/ConfirmModal.jsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title = '¿ESTÁS SEGURO?', 
  message = 'Esta acción no se puede deshacer.', 
  onConfirm, 
  onCancel, 
  confirmText = 'CONFIRMAR', 
  cancelText = 'CANCELAR',
  variant = 'danger' // 'danger' | 'warning' | 'info'
}) {
  if (!isOpen) return null;

  const colors = {
    danger: 'text-[#720E1C] border-[#720E1C]',
    warning: 'text-amber-600 border-amber-600',
    info: 'text-blue-600 border-blue-600'
  };

  const bgColors = {
    danger: 'bg-[#720E1C]',
    warning: 'bg-amber-600',
    info: 'bg-blue-600'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-zinc-900 w-full max-w-sm p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Decoración Brutalista */}
        <div className={`absolute top-0 right-0 w-16 h-16 ${bgColors[variant]} opacity-10 -mr-8 -mt-8 rotate-45`} />
        
        <div className="flex items-start gap-4">
          <div className={`p-3 border-2 ${colors[variant]} rounded-none`}>
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
              {title}
            </h3>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-zinc-200 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 hover:text-zinc-600 transition-all active:translate-y-0.5"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 text-white font-black uppercase text-[10px] tracking-widest transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${bgColors[variant]}`}
          >
            {confirmText}
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
