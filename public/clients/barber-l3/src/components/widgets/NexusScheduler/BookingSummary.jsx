// Archivo: src/components/widgets/NexusScheduler/BookingSummary.jsx
// v11.75-ELEGANT — Atomic booking summary block under 200 lines
'use client';
import React from 'react';

export default function BookingSummary({ selection, specialistName }) {
  const formattedDate = selection.date ? selection.date.split('-').reverse().join('/') : '';
  
  return (
    <div className="bg-zinc-50 border border-zinc-200 p-4 font-mono text-xs uppercase space-y-2 select-none">
      <div className="flex justify-between gap-4">
        <span className="text-neutral-500 font-bold">SERVICIO:</span>
        <span className="font-black text-right">{selection.service?.name}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-neutral-500 font-bold">CATEGORÍA:</span>
        <span className="font-black text-right">{selection.service?.category}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-neutral-500 font-bold">ESPECIALISTA:</span>
        <span className="font-black text-right">{specialistName}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-neutral-500 font-bold">FECHA:</span>
        <span className="font-black text-right">{formattedDate}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-neutral-500 font-bold">HORARIO:</span>
        <span className="font-black text-[#800000] text-right">{selection.time} HS</span>
      </div>
    </div>
  );
}
