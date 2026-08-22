// Archivo: src/app/admin/configuracion/sistema/components/HolidaysTable.jsx
// v11.98-GOLD — Vista responsiva dual (tarjetas en móvil y tabla en pantallas grandes)
import React from 'react';
import { Trash2 } from 'lucide-react';

export default function HolidaysTable({ holidays, loading, saving, toggleException, handleDelete }) {
  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase animate-pulse">Cargando base de feriados...</div>;
  }

  if (holidays.length === 0) {
    return <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase">No hay fechas bloqueadas en el calendario</div>;
  }

  return (
    <div className="w-full">
      {/* VISTA EN MÓVIL: Tarjetas apiladas verticalmente */}
      <div className="block md:hidden space-y-4 bg-transparent p-1">
        {holidays.map(h => (
          <div key={h.date} className="bg-white border-2 border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 break-words">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Fecha</span>
                <p className="text-sm font-bold text-zinc-800 leading-tight mt-0.5">{h.date}</p>
              </div>
              <span className="shrink-0 px-2.5 py-0.5 border border-zinc-200 text-[9px] uppercase font-bold text-zinc-500 rounded-full bg-zinc-50">
                {h.type}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Motivo / Descripción</span>
              <p className="text-xs font-semibold text-zinc-700 leading-normal mt-0.5">{h.desc}</p>
            </div>
            <div className="flex justify-between items-center pt-2 gap-2">
              <button
                type="button"
                onClick={() => toggleException(h.date)}
                disabled={saving}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${
                  h.isException 
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100/50' 
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100/50'
                }`}
              >
                {h.isException ? '🔓 ABIERTO (SÍ SE ATIENDE)' : '🔒 CERRADO (BLOQUEADO)'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(h.date)}
                disabled={saving}
                className="p-3 border border-zinc-200 text-zinc-400 hover:text-[#800000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VISTA EN DESKTOP: Tabla tradicional de alta resolución */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs uppercase font-semibold">
              <th className="p-4 font-semibold text-gray-700">FECHA</th>
              <th className="p-4 font-semibold text-gray-700">MOTIVO / DESCRIPCIÓN</th>
              <th className="p-4 font-semibold text-gray-700">TIPO</th>
              <th className="p-4 font-semibold text-gray-700 text-center">ATENCIÓN EN EL LOCAL</th>
              <th className="p-4 font-semibold text-gray-700 text-center">ELIMINAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {holidays.map(h => (
              <tr key={h.date} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{h.date}</td>
                <td className="p-4 font-medium text-gray-700">{h.desc}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 border border-gray-200 text-[10px] uppercase font-bold text-gray-500 rounded-full bg-gray-50">
                    {h.type}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    onClick={() => toggleException(h.date)}
                    disabled={saving}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                      h.isException 
                        ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100/50' 
                        : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100/50'
                    }`}
                  >
                    {h.isException ? '🔓 ABIERTO (SÍ SE ATIENDE)' : '🔒 CERRADO (BLOQUEADO)'}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(h.date)}
                    disabled={saving}
                    className="p-2 text-gray-400 hover:text-[#800000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
