"use client";

// Archivo: src/app/invitacion/components/VariantStreet.jsx
import React from "react";
import InvitationBackground from "./InvitationBackground";
import { IconHands } from "./InvitationIcons";

export default function VariantStreet() {
  return (
    <div className="w-full h-full text-white flex flex-col justify-between relative select-none box-border border-4 border-black overflow-hidden bg-[#6A1B29]">
      {/* Capa de Fondo Modularizada */}
      <InvitationBackground variant="street" />

      {/* Marca de agua brutalista diagonal */}
      <div className="absolute top-1/3 left-[-40px] right-[-40px] bg-black text-[#6A1B29] font-black text-[12px] py-1.5 text-center rotate-[-6deg] tracking-[0.4em] uppercase border-y border-white/10 shadow-lg z-10 opacity-90">
        ESTADO REHIDRATADO // FLYER VIBE
      </div>

      {/* CABECERA DE LA PLACA CON LOGO PROTAGONISTA */}
      <div className="p-5 pb-2 relative z-10 box-border flex flex-col items-center text-center">
        <div className="absolute top-4 right-5 text-white/40">
          <IconHands />
        </div>
        
        {/* Logo Principal Vinculado */}
        <div className="w-24 h-24 relative mb-3">
          <div className="absolute inset-0 rounded-full bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.9)]" />
          <img 
            src="/assets/images/logo_barber-l3-barberia-unisex.jpeg" 
            alt="Logo Nexus Barber L3 Barbería Unisex" 
            className="w-full h-full object-contain rounded-full border-2 border-white/40 shadow-xl relative z-10"
          />
        </div>
        
        {/* Slogan Darcy visible y con tipografía de diseño */}
        <div className="bg-black/90 px-3 py-2 border-x-2 border-white/80 shadow-md">
          <p className="font-serif text-xs font-bold tracking-wide text-white italic">
            &ldquo;Tu imagen también es un proyecto&rdquo;
          </p>
        </div>
      </div>

      {/* CUERPO CENTRAL DE VERIFICACIÓN (NODOS ICARO) */}
      <div className="px-6 py-2 relative z-10 flex-grow flex flex-col justify-center space-y-5 box-border">
        <div>
          <span className="inline-block bg-white text-[#6A1B29] font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
            ESTRENO OFICIAL
          </span>
          
          {/* Título Estricto */}
          <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            ¡INAUGURAMOS!
          </h2>
        </div>

        {/* Cuerpo Estricto */}
        <p className="text-xs text-zinc-100 leading-relaxed font-sans bg-black/90 p-4 border border-zinc-800 shadow-inner">
          Te esperamos este viernes para compartir un brindis y estrenar Nexus Barber L3 oficial en San Miguel de Tucumán.
        </p>

        {/* Datos de Logística Estrictos */}
        <div className="bg-white text-black p-4 font-mono relative shadow-[6px_6px_0px_0px_#000000]">
          <div className="space-y-2 text-xs">
            <div className="border-b border-zinc-200 pb-1.5">
              <span className="block text-[9px] text-[#6A1B29] font-bold uppercase tracking-wider">Logística / Cuándo</span>
              <span className="font-black text-black text-sm">Viernes 15, 18:00 hs</span>
            </div>
            
            <div className="pt-0.5">
              <span className="block text-[9px] text-[#6A1B29] font-bold uppercase tracking-wider">Ubicación</span>
              <span className="font-black text-black text-xs block">San Miguel de Tucumán</span>
              <span className="text-[10px] text-zinc-600 block">Planta Baja</span>
            </div>
          </div>
        </div>
      </div>

      {/* PIE DE LA PLACA */}
      <div className="p-6 pt-0 relative z-10 box-border">
        <div className="bg-black text-white p-3.5 text-center border-2 border-white/20">
          <p className="text-xs font-bold tracking-wider uppercase text-zinc-200">
            ¡Vení cuando quieras, te esperamos!
          </p>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-[8px] text-zinc-300 border-t border-white/10 pt-2 font-mono">
          <span>MANOS // PEINE // OJOS</span>
          <span className="font-bold text-white">WPP STORY 9:16</span>
        </div>
      </div>
    </div>
  );
}
