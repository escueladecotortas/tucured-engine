// Archivo: src/app/admin/configuracion/personal/components/AdminHeader.jsx
import React from 'react';
import { Plus } from 'lucide-react';

export default function AdminHeader({ onAddStaff }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-8">
      <div>
        <h2 className="text-3xl font-bold text-zinc-800 uppercase tracking-tighter">
          Gestión de Personal
        </h2>
        <p className="text-[11px] text-primary font-bold uppercase tracking-widest mt-1">
          Configuración de Staff & Disponibilidad
        </p>
      </div>
      <button 
        onClick={onAddStaff} 
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] uppercase tracking-widest hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20 font-bold"
      >
        <Plus size={16} /> Añadir Especialista
      </button>
    </header>
  );
}
