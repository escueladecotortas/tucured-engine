"use client";

// Archivo: src/app/invitacion/components/VariantMinimal.jsx
import React from "react";
import InvitationBackground from "./InvitationBackground";
import { IconEye, IconComb, IconHands } from "./InvitationIcons";

export default function VariantMinimal() {
  return (
    <div className="w-full h-full text-black flex flex-col justify-between relative select-none box-border border-4 border-[#6A1B29] overflow-hidden bg-white">
      {/* Capa de Fondo Modularizada con Textura Premium solicitada por Gabriela */}
      <InvitationBackground variant="minimal" />

      {/* CABECERA MINIMALISTA CON LOGO CENTRAL */}
      <div className="p-6 pt-8 pb-0 relative z-10 box-border flex items-center justify-between">
        <div className="text-[#6A1B29]">
          <IconEye />
        </div>
        <div className="flex flex-col items-center text-center">
          <img 
            src="/assets/images/logo_barber-l3-barberia-unisex.jpeg" 
            alt="Logo Nexus Barber L3 Barbería Unisex" 
            className="w-20 h-20 object-contain rounded-full border-2 border-[#6A1B29] shadow-md mb-2 bg-white"
          />
          <span className="text-[11px] font-black tracking-widest text-[#6A1B29] uppercase block font-mono">
            Nexus Barber L3
          </span>
          <span className="text-[8px] text-zinc-500 font-mono tracking-wider block uppercase">
            BARBERÍA UNISEX
          </span>
        </div>
        <div className="text-[#6A1B29]">
          <IconComb />
        </div>
      </div>

      {/* CUERPO CENTRAL MINIMALISTA (NODOS ICARO) */}
      <div className="px-8 py-4 relative z-10 flex-grow flex flex-col justify-center space-y-6 box-border">
        {/* Slogan Darcy visible y con tipografía de diseño */}
        <div>
          <span className="inline-block bg-[#6A1B29] text-white font-serif text-xs font-bold px-3 py-1 italic tracking-wide mb-4 shadow-sm">
            &ldquo;Tu imagen también es un proyecto&rdquo;
          </span>
          
          {/* Título Estricto */}
          <h2 className="text-5xl font-black tracking-tighter text-black uppercase leading-none font-sans">
            ¡INAUGURAMOS!
          </h2>
        </div>

        {/* Cuerpo Estricto */}
        <p className="text-xs text-zinc-800 leading-relaxed font-sans border-l-2 border-[#6A1B29] pl-4 py-1">
          Te esperamos este viernes para compartir un brindis y estrenar Nexus Barber L3 oficial en San Miguel de Tucumán.
        </p>

        {/* Logística Estricta Limpia */}
        <div className="bg-white p-5 border border-zinc-200 shadow-sm space-y-3 font-sans relative z-10">
          <div>
            <span className="block text-[9px] text-[#6A1B29] uppercase tracking-widest font-mono font-bold">Logística</span>
            <span className="text-sm font-black text-black block">Viernes 15, 18:00 hs</span>
          </div>

          <div className="pt-1 border-t border-zinc-100">
            <span className="block text-[9px] text-zinc-400 uppercase tracking-widest font-mono">Lugar</span>
            <span className="text-xs font-black text-black block">San Miguel de Tucumán</span>
            <span className="text-[10px] text-zinc-500 block">Planta Baja</span>
          </div>
        </div>
      </div>

      {/* PIE MINIMALISTA */}
      <div className="p-8 pb-10 relative z-10 box-border">
        <div className="bg-[#6A1B29] text-white p-4 text-center shadow-md">
          <p className="text-xs font-bold tracking-wider uppercase font-mono">
            ¡Vení cuando quieras, te esperamos!
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[9px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1 text-[#6A1B29]">
            <IconHands />
            <span className="text-zinc-500">CREATIVA</span>
          </span>
          <span className="tracking-widest uppercase text-zinc-500">San Miguel de Tucumán</span>
        </div>
      </div>
    </div>
  );
}
