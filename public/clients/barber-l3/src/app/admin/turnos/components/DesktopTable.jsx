// Archivo: src/app/admin/turnos/components/DesktopTable.jsx
import React from 'react';
import { 
  ArrowUpDown, 
  Check, 
  X, 
  RefreshCcw,
  ExternalLink
} from 'lucide-react';
import { 
  formatAppointmentDate, 
  cleanWhatsAppForDisplay, 
  getWhatsAppLink 
} from '../utils/formatters';

export default function DesktopTable({
  filteredData,
  sort,
  setSort,
  onUpdateStatus,
  getStatusBadge
}) {
  const columns = [
    { label: 'Cliente', key: 'resolvedClient.firstName' },
    { label: 'Servicios', key: 'resolvedService.name' },
    { label: 'Cita', key: 'time' },
    { label: 'Estado', key: 'status' }
  ];

  const handleSort = (key) => {
    setSort(s => ({ key, dir: s.dir === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <div className="hidden md:block bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs select-none">
      <table className="w-full text-left">
        <thead className="bg-zinc-50 text-[#720E1C] font-black uppercase border-b-2 border-zinc-200 tracking-tight text-[10px]">
          <tr>
            {columns.map(h => (
              <th 
                key={h.key} 
                className="p-4 cursor-pointer hover:text-[#720E1C]/80 transition-colors" 
                onClick={() => handleSort(h.key)}
              >
                <div className="flex items-center gap-1.5 font-black">
                  {h.label} <ArrowUpDown size={11} className="text-zinc-400" />
                </div>
              </th>
            ))}
            <th className="p-4 text-right text-[#720E1C] font-black">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {filteredData.map(a => {
            const currentStatus = String(a.status || 'pending').toLowerCase();
            const waNumber = a.resolvedClient?.whatsapp;
            const waDisplay = cleanWhatsAppForDisplay(waNumber);
            const waLink = getWhatsAppLink(waNumber);

            return (
              <tr 
                key={a.id} 
                className="hover:bg-zinc-50/80 transition-colors group odd:bg-white even:bg-zinc-50/40 text-[11px]"
              >
                <td className="p-4">
                  <div className="text-[#333333] font-black tracking-tight text-xs">
                    {a.resolvedClient 
                      ? `${a.resolvedClient.firstName || ''} ${a.resolvedClient.lastName || ''}`.trim() || a.resolvedClient.name || 'Sin Nombre'
                      : 'Desconocido'}
                  </div>
                  {waLink ? (
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] text-green-600 mt-0.5 font-sans font-bold hover:underline flex items-center gap-1"
                    >
                      {waDisplay} <ExternalLink size={8} />
                    </a>
                  ) : (
                    <div className="text-[9px] text-zinc-500 mt-0.5 font-sans font-bold">
                      N/A
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    {a.resolvedServices?.length > 0 ? (
                      a.resolvedServices.map(rs => (
                        <span key={rs.id} className="uppercase font-bold text-[#333333]">
                          {(rs.name || 'Sin Nombre').toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400 font-bold">Servicio General</span>
                    )}
                  </div>
                  <span className="text-[#720E1C] font-black tracking-tight mt-1 block text-xs">
                    ${a.price ?? '0'} {a.totalDuration ? `(${a.totalDuration}')` : ''}
                  </span>
                </td>
                <td className="p-4 text-[#333333] font-black whitespace-nowrap">
                  {formatAppointmentDate(a.dateString, a.timeString)}
                </td>
                <td className="p-4">
                  {getStatusBadge(a.status)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-1.5 justify-end opacity-100 transition-all duration-200">
                    {currentStatus !== 'confirmed' && (
                      <button 
                        onClick={() => onUpdateStatus(a.id, 'confirmed')} 
                        title="Confirmar" 
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-green-50 border border-green-200 text-green-700 hover:bg-green-600 hover:text-white rounded-lg transition-all font-bold"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    {currentStatus !== 'cancelled' && (
                      <button 
                        onClick={() => onUpdateStatus(a.id, 'cancelled')} 
                        title="Cancelar" 
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-rose-50 border border-rose-200 text-[#720E1C] hover:bg-[#720E1C] hover:text-white rounded-lg transition-all font-bold"
                      >
                        <X size={13} />
                      </button>
                    )}
                    {currentStatus === 'cancelled' && (
                      <button 
                        onClick={() => onUpdateStatus(a.id, 'pending')} 
                        title="Re-activar" 
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-600 hover:text-white rounded-lg transition-all font-bold"
                      >
                        <RefreshCcw size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
