// Archivo: src/components/sections/ServiceCard.jsx
// v11.75-ELEGANT — Premium service card linked with full booking context
"use client";
import React from "react";

export default function ServiceCard({ spec, onServiceSelect }) {
  return (
    <div className="p-5 md:p-6 rounded-lg relative overflow-hidden group border-l-4 border-l-[#800000] bg-white/95 backdrop-blur-md border border-neutral-200/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between font-hanken">
        <h3 className="text-base md:text-lg font-semibold text-[#800000] uppercase tracking-widest">
          {spec.visualTitle}
        </h3>
        <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#800000]/10 text-[#800000] rounded tracking-wider uppercase">
          {spec.firstNameOnly}
        </span>
      </div>
      <p className="text-xs md:text-sm text-neutral-600 mb-4 font-medium bg-neutral-50 p-2.5 rounded border border-neutral-200/40 font-mono">
        {spec.hoursObj.landing}
      </p>
      <ul className="flex flex-col gap-2">
        {spec.services.map((s) => (
          <li 
            key={s.id} 
            onClick={() => onServiceSelect(s, spec.id, spec.specialistName)}
            className="py-3 px-4 bg-white border border-neutral-100 flex justify-between items-center rounded hover:bg-neutral-50 hover:border-[#800000]/30 transition-all cursor-pointer group/item shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="flex flex-col">
              <span className="font-bold text-neutral-800 text-xs md:text-sm uppercase tracking-wide group-hover/item:text-[#800000] transition-colors">
                {s.name}
              </span>
              {(s.mostrarPrecioWeb || s.mostrarDuracionWeb) && (
                <div className="flex items-center gap-2 mt-1 text-[10px] md:text-[11px] font-bold text-neutral-400 font-mono">
                  {s.mostrarPrecioWeb && (
                    <span>${Number(s.price || 0).toLocaleString('es-AR')}</span>
                  )}
                  {s.mostrarPrecioWeb && s.mostrarDuracionWeb && (
                    <span className="text-neutral-300">•</span>
                  )}
                  {s.mostrarDuracionWeb && (
                    <span>{s.duration} MIN</span>
                  )}
                </div>
              )}
            </div>
            <span className="text-[11px] font-bold text-[#800000] border border-[#800000]/20 px-3 py-1 rounded bg-[#800000]/5 group-hover/item:bg-[#800000] group-hover/item:text-white transition-all uppercase tracking-widest font-mono">
              Agendar →
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
