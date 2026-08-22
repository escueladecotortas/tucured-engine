// Archivo: src/app/admin/turnos/components/MobileCardList.jsx
import React from 'react';
import { 
  Check, 
  X, 
  RefreshCcw,
  Phone,
  User,
  Scissors,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { 
  formatAppointmentDate, 
  cleanWhatsAppForDisplay, 
  getWhatsAppLink 
} from '../utils/formatters';

export default function MobileCardList({ filteredData, onUpdateStatus, getStatusBadge }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {filteredData.map(a => {
        const currentStatus = String(a.status || 'pending').toLowerCase();
        const waNumber = a.resolvedClient?.whatsapp;
        const waDisplay = cleanWhatsAppForDisplay(waNumber);
        const waLink = getWhatsAppLink(waNumber);

        return (
          <div key={a.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#720E1C]/10" />
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] text-[#720E1C] font-black uppercase tracking-widest flex items-center gap-1">
                  <User size={10} /> Cliente
                </p>
                <h4 className="text-sm font-black text-[#333333] tracking-tight">
                  {a.resolvedClient 
                    ? `${a.resolvedClient.firstName || ''} ${a.resolvedClient.lastName || ''}`.trim() || a.resolvedClient.name || 'Sin Nombre'
                    : 'Desconocido'}
                </h4>
                {waLink ? (
                  <a 
                    href={waLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] hover:underline"
                  >
                    <Phone size={10} /> {waDisplay} <ExternalLink size={8} />
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[10px]">
                    <Phone size={10} /> N/A
                  </div>
                )}
              </div>
              {getStatusBadge(a.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
              <div className="space-y-1">
                <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1">
                  <Scissors size={10} /> Servicio
                </p>
                <div className="flex flex-col gap-0.5">
                  {a.resolvedServices?.length > 0 ? (
                    a.resolvedServices.map(rs => (
                      <span key={rs.id} className="uppercase font-bold text-[#333333] text-[10px]">
                        {(rs.name || 'Sin Nombre').toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-400 font-bold text-[10px]">General</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={10} /> Cita
                </p>
                <p className="text-[10px] font-black text-[#720E1C]">
                  {formatAppointmentDate(a.dateString, a.timeString)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {currentStatus !== 'confirmed' && (
                <button 
                  onClick={() => onUpdateStatus(a.id, 'confirmed')} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 min-h-[44px] bg-green-50 border border-green-200 text-green-700 rounded-xl transition-all font-black uppercase text-[10px] hover:bg-green-600 hover:text-white active:scale-95"
                >
                  <Check size={14} /> Confirmar
                </button>
              )}
              {currentStatus !== 'cancelled' && (
                <button 
                  onClick={() => onUpdateStatus(a.id, 'cancelled')} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 min-h-[44px] bg-rose-50 border border-rose-200 text-[#720E1C] rounded-xl transition-all font-black uppercase text-[10px] hover:bg-[#720E1C] hover:text-white active:scale-95"
                >
                  <X size={14} /> Cancelar
                </button>
              )}
              {currentStatus === 'cancelled' && (
                <button 
                  onClick={() => onUpdateStatus(a.id, 'pending')} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 min-h-[44px] bg-amber-50 border border-amber-200 text-amber-700 rounded-xl transition-all font-black uppercase text-[10px] hover:bg-amber-600 hover:text-white active:scale-95"
                >
                  <RefreshCcw size={14} /> Re-activar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
