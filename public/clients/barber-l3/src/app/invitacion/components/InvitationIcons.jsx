"use client";

// Archivo: src/app/invitacion/components/InvitationIcons.jsx
import React from "react";

export const IconEye = ({ className = "w-5 h-5 inline-block" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconComb = ({ className = "w-5 h-5 inline-block" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M3 8h18v5H3V8z" />
    <path d="M5 13v5m3-5v5m3-5v5m3-5v5m3-5v5" strokeLinecap="round" />
  </svg>
);

export const IconHands = ({ className = "w-5 h-5 inline-block" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M10.5 15l4.5-4.5m-3.5 6l4.5-4.5" strokeLinecap="round" />
    <path d="M18 11.5a2.5 2.5 0 00-5 0v-2a2.5 2.5 0 00-5 0v6l-2 1.5c-1 1-1 2.5 0 3.5h9.5a3.5 3.5 0 003.5-3.5v-5.5z" />
  </svg>
);

/**
 * Patrón Dinámico de Iconos distribuidos de forma orgánica/aleatoria
 * Cumple con el mandato de textura Street sobre fondo limpio.
 */
export default function InvitationIcons({ className = "text-[#6A1B29]/5", style }) {
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={style}
    >
      {/* Distribución orgánica y aleatoria de los iconos de la marca */}
      <div className="absolute top-10 left-8 scale-[2.2] rotate-12">
        <IconHands className="w-12 h-12" />
      </div>
      <div className="absolute top-20 right-12 scale-[2.5] -rotate-12">
        <IconEye className="w-10 h-10" />
      </div>
      <div className="absolute top-1/3 left-16 scale-[2.0] rotate-45">
        <IconComb className="w-12 h-12" />
      </div>
      <div className="absolute top-1/3 right-8 scale-[1.8] -rotate-45">
        <IconHands className="w-10 h-10" />
      </div>
      <div className="absolute top-1/2 left-6 scale-[2.4] -rotate-12">
        <IconEye className="w-12 h-12" />
      </div>
      <div className="absolute top-1/2 right-16 scale-[2.2] rotate-12">
        <IconComb className="w-10 h-10" />
      </div>
      <div className="absolute bottom-1/3 left-12 scale-[2.6] rotate-12">
        <IconHands className="w-12 h-12" />
      </div>
      <div className="absolute bottom-1/4 right-10 scale-[2.1] -rotate-12">
        <IconEye className="w-12 h-12" />
      </div>
      <div className="absolute bottom-12 left-20 scale-[1.9] -rotate-6">
        <IconComb className="w-10 h-10" />
      </div>
      <div className="absolute bottom-8 right-16 scale-[2.3] rotate-15">
        <IconHands className="w-12 h-12" />
      </div>
    </div>
  );
}
