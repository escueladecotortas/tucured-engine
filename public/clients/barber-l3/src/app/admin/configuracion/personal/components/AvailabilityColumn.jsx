// Archivo: src/app/admin/configuracion/personal/components/AvailabilityColumn.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

export const DAYS = [
  { key: 'monday', label: 'LUNES' },
  { key: 'tuesday', label: 'MARTES' },
  { key: 'wednesday', label: 'MIÉRCOLES' },
  { key: 'thursday', label: 'JUEVES' },
  { key: 'friday', label: 'VIERNES' },
  { key: 'saturday', label: 'SÁBADO' },
  { key: 'sunday', label: 'DOMINGO' }
];

export default function AvailabilityColumn({ workingHours, toggleDay, updateTime }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] text-zinc-800 uppercase tracking-widest ml-1 flex items-center gap-2 font-bold">
        <Calendar size={12} className="text-primary" /> Disponibilidad Horaria
      </label>
      <div className="space-y-2">
        {DAYS.map(day => {
          const config = workingHours[day.key];
          return (
            <div key={day.key} className={`p-4 rounded-xl border transition-all duration-300 ${config.active ? 'bg-zinc-50 border-zinc-200 shadow-sm' : 'bg-white border-zinc-100 opacity-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold tracking-tight ${config.active ? 'text-zinc-800' : 'text-zinc-400'}`}>{day.label}</span>
                <button 
                  type="button"
                  onClick={() => toggleDay(day.key)}
                  className={`text-[9px] px-3 py-1 rounded-lg border transition-all font-bold uppercase tracking-widest ${config.active ? 'border-primary text-primary bg-primary/5 hover:bg-primary/10' : 'border-zinc-200 text-zinc-400 bg-white hover:bg-zinc-50'}`}
                >
                  {config.active ? 'Habilitado' : 'Libre'}
                </button>
              </div>
              {config.active && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5">
                    <p className="text-[8px] text-zinc-400 uppercase font-bold ml-1">Inicio</p>
                    <input 
                      type="time" 
                      value={config.start} 
                      onChange={(e) => updateTime(day.key, 'start', e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-[11px] p-2.5 rounded-xl text-zinc-800 font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-[8px] text-zinc-400 uppercase font-bold ml-1">Fin</p>
                    <input 
                      type="time" 
                      value={config.end} 
                      onChange={(e) => updateTime(day.key, 'end', e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-[11px] p-2.5 rounded-xl text-zinc-800 font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
