// Archivo: src/app/admin/configuracion/servicios/components/TableList.jsx
import React from 'react';
import { Layers, Scissors, Edit3, Trash2 } from 'lucide-react';

export default function TableList({ services, loading, onEdit, onDelete }) {
  const safeServices = Array.isArray(services) ? services : [];

  // Agrupar servicios por categoría
  const groupedServices = safeServices.reduce((acc, s) => {
    const cat = s.category || 'SIN CATEGORÍA';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#800000] border-b border-[#800000]">
              <th className="px-6 py-4 text-[10px] font-bold text-white/90 uppercase tracking-widest">Servicio</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/90 uppercase tracking-widest text-center">Duración</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/90 uppercase tracking-widest text-center">Previas</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/90 uppercase tracking-widest text-center">Precio</th>
              <th className="px-6 py-4 text-[10px] font-bold text-white/90 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Sincronizando búnker...</span>
                  </div>
                </td>
              </tr>
            ) : safeServices.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                  No hay servicios registrados
                </td>
              </tr>
            ) : (
              Object.entries(groupedServices).map(([category, catServices]) => (
                <React.Fragment key={category}>
                  <tr className="bg-zinc-50/50">
                    <td colSpan="5" className="px-6 py-3 border-y border-zinc-100">
                      <div className="flex items-center gap-2">
                        <Layers size={14} className="text-[#800000]" />
                        <span className="text-[11px] font-bold text-[#800000] uppercase tracking-widest">{category}</span>
                      </div>
                    </td>
                  </tr>
                  {catServices.map(s => (
                    <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#800000]/60">
                            <Scissors size={14} />
                          </div>
                          <span className="text-sm font-bold text-zinc-800 uppercase tracking-tight">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase">{s.duration || 45} MIN</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase">{s.advanceHoursRequired !== undefined ? s.advanceHoursRequired : 2} HS</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-[#800000] tracking-tighter">${s.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onEdit(s)}
                            className="p-2.5 text-[#800000] bg-white hover:bg-[#800000] hover:text-white rounded-xl border border-zinc-200 transition-all shadow-sm"
                            title="Editar"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(s.id)}
                            className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-zinc-100 transition-all shadow-sm"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Diseño Líquido) */}
      <div className="md:hidden divide-y divide-zinc-100">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Cargando...</span>
          </div>
        ) : Object.entries(groupedServices).map(([category, catServices]) => (
          <div key={category} className="p-4 space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Layers size={14} className="text-[#800000]" />
              <span className="text-[10px] font-bold text-[#800000] uppercase tracking-widest">{category}</span>
            </div>
            {catServices.map(s => (
              <div key={s.id} className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-[#800000]/60">
                      <Scissors size={14} />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-800 uppercase tracking-tight">{s.name}</h4>
                  </div>
                  <span className="text-lg font-bold text-[#800000]">${s.price}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">{s.duration || 45} MINUTOS</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">ANTICIPACIÓN: {s.advanceHoursRequired !== undefined ? s.advanceHoursRequired : 2} HS</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(s)}
                      className="p-3 bg-white text-[#800000] rounded-xl border border-zinc-200 shadow-sm active:scale-95 transition-transform"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(s.id)}
                      className="p-3 bg-white text-rose-600 rounded-xl border border-zinc-200 shadow-sm active:scale-95 transition-transform"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
