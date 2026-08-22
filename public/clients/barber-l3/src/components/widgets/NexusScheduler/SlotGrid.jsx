// Archivo: src/components/widgets/NexusScheduler/SlotGrid.jsx
// v11.75-ELEGANT — Atomic brutalist slot grid with Buenos Aires timezone
'use client';
import React from 'react';

export default function SlotGrid({ slots, selectedDate, onSelect, isToday, nowH, nowM }) {
  if (slots.length === 0) {
    return (
      <div className="py-8 text-center border border-dashed border-zinc-300 bg-zinc-50 p-4 select-none">
        <span className="text-[10px] uppercase font-bold text-neutral-500">NO HAY TURNOS DISPONIBLES PARA ESTE DÍA</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isBooked = slot.status === 'booked' || slot.isOccupied;
        const hourParts = slot.time.split(':');
        const slotH = Number(hourParts[0]);
        const slotM = Number(hourParts[1]);
        const isPast = isToday && (slotH < nowH || (slotH === nowH && slotM <= nowM));
        const isDisabled = isBooked || isPast;

        return (
          <button 
            key={slot.time}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect({ date: selectedDate, time: slot.time })}
            className={`p-2.5 border text-center text-xs font-black font-mono transition-all duration-200 rounded-none select-none ${
              isDisabled 
                ? 'border-zinc-100 bg-zinc-50 text-zinc-400 cursor-not-allowed line-through' 
                : 'border-zinc-300 bg-white text-neutral-800 hover:bg-[#800000] hover:text-white hover:border-[#800000] cursor-pointer shadow-sm hover:shadow active:translate-y-0.5'
            }`}
          >
            {slot.time} HS
          </button>
        );
      })}
    </div>
  );
}
