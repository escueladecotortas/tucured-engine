"use client";

// Archivo: src/app/invitacion/components/InvitationBackground.jsx
import React from "react";
import InvitationIconsPattern, { IconEye, IconComb } from "./InvitationIcons";

export default function InvitationBackground({ variant }) {
  if (variant === "street") {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Imagen de fondo Lifestyle con máxima dominancia e integración */}
        <img 
          src="/assets/images/Flyer Nexus Barber L3.png" 
          alt="Nexus Barber L3 Corte con Diseño" 
          className="w-full h-full object-cover object-center grayscale contrast-125 mix-blend-luminosity opacity-40"
        />
        {/* Overlay texturizado Bordó Dominante */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A1B29]/90 via-[#6A1B29]/70 to-black/95" />
        {/* Patrón de líneas creativas urbanas */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Iconos integrados artísticamente en el fondo */}
        <div className="absolute top-24 right-6 text-white/20 scale-125">
          <IconEye />
        </div>
        <div className="absolute bottom-40 left-6 text-white/15 scale-150">
          <IconComb />
        </div>
      </div>
    );
  }

  // Variante B: Minimal-Premium con textura dinámica de iconos y fondo blanco puro
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-white">
      {/* Franjas de Acento Dominante en Bordó Logo */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-[#6A1B29]" />
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#6A1B29]" />

      {/* Sutil línea divisoria minimalista */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-100" />

      {/* Inyección de Componente Dinámico de Iconos con prop de color claro (Bordó con opacidad al 5%) */}
      <InvitationIconsPattern className="text-[#6A1B29]/5" style={{ color: '#6A1B29', opacity: 0.05 }} />

      {/* Iconografía de agua geométrica F original superpuesta suavemente */}
      <div className="absolute right-[-40px] bottom-16 opacity-5">
        <span className="text-[220px] font-black font-sans leading-none text-[#6A1B29]">F</span>
      </div>
    </div>
  );
}
