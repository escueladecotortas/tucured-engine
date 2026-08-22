// Archivo: src/components/widgets/NexusScheduler/Confirmation.jsx
'use client';
import React from 'react';

export default function Confirmation({ selection, onConfirm, onBack, loading }) {
  const { service, date, time, client } = selection;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-4">
      <div className="flex justify-between items-end border-b-2 border-ink pb-4">
        <div className="space-y-1">
          <h3 className="font-mono font-black text-2xl sm:text-3xl tracking-tighter text-ink uppercase">
            Confirmación
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-alert font-bold">Verificación de Ticket</p>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-widest bg-ink text-white px-2 py-0.5 border border-ink font-bold hidden sm:block">
          PASO 4 // 4
        </div>
      </div>

      {/* TICKET BRUTALISTA DE INSPECCIÓN TÉCNICA */}
      <div className="relative bg-white border-2 border-ink p-6 sm:p-8 shadow-[8px_8px_0px_#000000] space-y-6">
        {/* Sello o cota superior */}
        <div className="absolute top-0 right-0 bg-ink text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border-b border-l border-ink">
          TICKET // REVISIÓN
        </div>

        <div className="space-y-4 font-mono text-xs sm:text-sm pt-2">
          <div className="flex justify-between items-end border-b-2 border-ink pb-2">
            <span className="text-[10px] uppercase text-ink font-black tracking-wider">Servicio</span>
            <span className="text-ink font-black uppercase tracking-tight">{service?.name}</span>
          </div>
          <div className="flex justify-between items-end border-b-2 border-ink pb-2">
            <span className="text-[10px] uppercase text-ink font-black tracking-wider">Fecha</span>
            <span className="text-ink font-black">{date?.split('-').reverse().join('/')}</span>
          </div>
          <div className="flex justify-between items-end border-b-2 border-ink pb-2">
            <span className="text-[10px] uppercase text-ink font-black tracking-wider">Bloque Asignado</span>
            <span className="text-alert font-black">{time} HS</span>
          </div>
          <div className="flex justify-between items-end border-b-2 border-ink pb-2">
            <span className="text-[10px] uppercase text-ink font-black tracking-wider">Especialista</span>
            <span className="text-ink font-black uppercase">{selection.specialistName || 'Especialista'}</span>
          </div>
          <div className="flex justify-between items-end border-b-2 border-ink pb-2">
            <span className="text-[10px] uppercase text-ink font-black tracking-wider">Titular</span>
            <span className="text-ink font-black uppercase">{client?.firstName} {client?.lastName}</span>
          </div>
          <div className="flex justify-between items-end border-b-2 border-ink pb-2">
            <span className="text-[10px] uppercase text-ink font-black tracking-wider">WhatsApp</span>
            <span className="text-ink font-black">{client?.whatsapp}</span>
          </div>
        </div>

        {/* Línea troquelada brutalista */}
        <div className="pt-2 flex justify-between items-center overflow-hidden gap-1.5">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="w-4 h-1 bg-ink inline-block shrink-0" />
          ))}
        </div>
        <div className="text-center">
          <p className="text-[9px] text-ink uppercase tracking-widest font-black">
            San Miguel de Tucumán // PABELLÓN 3
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button 
          disabled={loading}
          onClick={onConfirm}
          className="w-full h-16 bg-alert text-white font-mono uppercase text-xs tracking-widest font-black border-2 border-ink shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000000] transition-all rounded-none disabled:bg-zinc-800 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000000]"
        >
          {loading ? 'PROCESANDO BLOQUE...' : 'CONFIRMÁ RESERVA // EMITIR TICKET'}
        </button>
        <button 
          onClick={onBack}
          className="mx-auto pt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ink hover:text-alert transition-colors font-black"
        >
          ← Corregir Datos
        </button>
      </div>
    </div>
  );
}
