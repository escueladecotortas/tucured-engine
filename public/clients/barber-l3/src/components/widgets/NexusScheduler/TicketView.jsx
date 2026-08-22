// Archivo: src/components/widgets/NexusScheduler/TicketView.jsx
// v11.75-ELEGANT — Atomic ticket view component with high-end elegant borders
'use client';
import React from 'react';

export default function TicketView({ selection, onClose }) {
  const formattedDate = selection.date ? selection.date.split('-').reverse().join('/') : '';

  return (
    <div className="text-center py-4 space-y-5 animate-in fade-in duration-500 font-mono text-neutral-900 select-none">
      <div className="space-y-4 border border-dashed border-zinc-400 p-5 bg-white text-left relative shadow-sm">
        <div className="absolute top-0 right-0 bg-[#800000] border-l border-b border-zinc-300 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest">
          TICKET DIGITAL
        </div>
        
        <div className="text-center pb-3 border-b border-dashed border-zinc-200">
          <h3 className="text-base font-black tracking-tight text-[#800000] uppercase">¡RESERVA CONFIRMADA!</h3>
          <p className="text-[9px] text-neutral-500 font-bold uppercase mt-1">Presentá este ticket en el local</p>
        </div>

        <div className="space-y-2 text-xs pt-2">
          <p className="flex justify-between gap-4">
            <span className="text-neutral-500 font-bold">CLIENTE:</span> 
            <span className="font-black text-right">{selection.client.firstName} {selection.client.lastName}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-neutral-500 font-bold">SERVICIO:</span> 
            <span className="font-black text-right">{selection.service?.name}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-neutral-500 font-bold">ESPECIALISTA:</span> 
            <span className="font-black text-right">{selection.specialistName || 'Cualquier profesional'}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-neutral-500 font-bold">FECHA:</span> 
            <span className="font-black text-right">{formattedDate}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-neutral-500 font-bold">HORARIO:</span> 
            <span className="font-black text-[#800000] text-right">{selection.time} HS</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-neutral-500 font-bold">DIRECCIÓN:</span> 
            <span className="font-black text-right text-xs">San Miguel de Tucumán</span>
          </p>
        </div>

        <div className="border-t border-dashed border-zinc-200 pt-3 text-center">
          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">ECOSISTEMA Nexus Barber L3</span>
        </div>
      </div>

      <button 
        onClick={onClose} 
        className="w-full py-3.5 bg-neutral-800 text-white font-black uppercase text-xs border border-neutral-800 hover:bg-[#800000] hover:border-[#800000] transition-all rounded-none tracking-widest cursor-pointer shadow-sm active:translate-y-0.5"
      >
        CERRAR VENTANA
      </button>
    </div>
  );
}
