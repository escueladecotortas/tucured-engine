// Archivo: src/components/widgets/NexusScheduler/ReminderModal.jsx
// v11.75-ELEGANT — Atomic booking reminder dialog under 200 lines
'use client';
import React from 'react';

export default function ReminderModal({ lastBooking, onConfirm, onIgnore }) {
  if (!lastBooking) return null;
  const formattedDate = lastBooking.date ? lastBooking.date.split('-').reverse().join('/') : '';
  
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#F9F9F9] border border-zinc-300 p-6 text-center space-y-4 shadow-sm rounded-none w-full max-w-md">
        <span className="inline-block bg-[#800000] text-white font-black text-[9px] tracking-widest px-3 py-1 uppercase border border-[#800000]">
          RESERVA ENCONTRADA
        </span>
        <h4 className="font-black text-lg uppercase text-neutral-900">¡HOLA, {lastBooking.client.firstName}!</h4>
        <p className="text-xs text-neutral-600 font-bold leading-relaxed uppercase">
          Tenés un turno reservado para el <br/>
          <span className="text-[#800000] font-black underline">{formattedDate}</span> a las <span className="text-[#800000] font-black underline">{lastBooking.time} HS</span>.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button 
            onClick={onConfirm} 
            className="w-full py-3 bg-neutral-800 text-white font-black text-xs uppercase hover:bg-[#800000] transition-colors cursor-pointer border border-neutral-800 shadow-sm active:translate-y-0.5 active:shadow-none"
          >
            VER TICKET DIGITAL
          </button>
          <button 
            onClick={onIgnore} 
            className="text-neutral-400 text-[9px] uppercase tracking-widest hover:text-[#800000] transition-colors mt-1 font-bold cursor-pointer"
          >
            [IGNORAR E INICIAR NUEVO TURNO]
          </button>
        </div>
      </div>
    </div>
  );
}
