// Archivo: src/app/admin/turnos/components/ServicesSelector.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ServicesSelector({
  services,
  selectedIds = [],
  onChange
}) {
  // Agrupar servicios por categoría
  const groupedServices = React.useMemo(() => {
    return services.reduce((acc, s) => {
      const cat = s.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});
  }, [services]);

  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

  const handleSelect = (serviceId) => {
    // Modo selección única para Admin
    onChange([serviceId]);
  };

  return (
    <div className="space-y-2 select-none">
      <label className="text-[10px] text-[#333333] uppercase tracking-widest ml-1 font-black">
        Servicio (Selección Única)
      </label>
      <div className="bg-white border border-zinc-300 p-3 rounded-lg grid grid-cols-1 gap-4 max-h-40 overflow-y-auto shadow-xs">
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
            <AlertCircle size={20} className="text-[#720E1C] animate-pulse" />
            <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold">
              No hay servicios configurados
            </p>
          </div>
        ) : (
          Object.entries(groupedServices)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, catServices]) => (
              <div key={category} className="space-y-2">
                <div className="text-[8px] font-black text-[#720E1C] uppercase tracking-widest border-b border-zinc-200 pb-1">
                  {category}
                </div>
                <div className="space-y-1">
                  {catServices
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map(s => (
                      <label 
                        key={s.id} 
                        className="flex items-center gap-2 text-[#333333] font-bold text-[10px] uppercase cursor-pointer hover:text-[#720E1C] transition-colors"
                      >
                        <input 
                          type="radio" 
                          name="service-selection"
                          className="accent-[#720E1C]"
                          checked={safeSelectedIds.includes(s.id)}
                          onChange={() => handleSelect(s.id)}
                        />
                        {(s.name || 'Sin Nombre').toUpperCase()} - <span className="text-[#720E1C] font-black">${(s.price || 0)}</span> ({(s.duration || 45)}')
                      </label>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>
      {services.length === 0 && (
        <p className="text-[8px] text-[#720E1C] mt-2 flex items-center gap-1 font-bold">
          <AlertCircle size={10} />
          Configura servicios en la sección correspondiente antes de operar.
        </p>
      )}
    </div>
  );
}
