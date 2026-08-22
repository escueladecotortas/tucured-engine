// Archivo: src/app/admin/configuracion/servicios/components/AdminHeader.jsx
import React from 'react';
import { Plus, RefreshCcw } from 'lucide-react';

export default function AdminHeader({ loading, onRefresh, onCreate }) {
  return (
    <header className="flex justify-between items-center border-b border-zinc-200 pb-8">
      <div>
        <h2 className="text-3xl font-bold text-zinc-800 uppercase tracking-tighter">
          Gestión de Servicios
        </h2>
        <p className="text-[11px] text-primary font-bold uppercase tracking-widest mt-1">
          Configuración Soberana / Nexus OS
        </p>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onRefresh} 
          className="p-2 text-zinc-500 hover:text-primary transition-colors"
          title="Sincronizar datos"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
        <button 
          onClick={onCreate} 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[10px] uppercase tracking-widest hover:bg-primary/90 rounded transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={14} /> Nuevo Servicio
        </button>
      </div>
    </header>
  );
}
