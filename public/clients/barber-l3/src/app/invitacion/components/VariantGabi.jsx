"use client";

// Archivo: src/app/invitacion/components/VariantGabi.jsx
// Destinatarios: CODI (Ingeniería Atómica) y ATENEA (Lógica Visual)
// Misión: Ensamblaje determinista de la variante física final Gabi con rutas absolutas locales
import React from "react";

export default function VariantGabi() {
  return (
    <div className="w-full h-full text-black flex flex-col justify-between relative select-none box-border border-4 border-[#6A1B29] overflow-hidden bg-white font-sans">
      {/* CAPA DE FONDO BASE: Archivo físico original referenciado con ruta absoluta estricta */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/assets/images/Flyer Nexus Barber L3.png" 
          alt="Flyer Físico Original Nexus Barber L3" 
          data-source-path="C:\Users\leola\Downloads\barber-l3\public\assets\images\Flyer Nexus Barber L3.png"
          className="w-full h-full object-cover absolute inset-0"
        />
        {/* Máscara de Luminosidad al 92% (Blanqueo) para que los trazos técnicos queden como marca de agua sutil */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: "rgba(255, 255, 255, 0.92)" }} 
        />
      </div>

      {/* COMPOSICIÓN SUPERIOR: Logo Oficial Circular Superpuesto con ruta absoluta */}
      <div className="pt-8 px-6 relative z-10 flex flex-col items-center text-center box-border">
        <img 
          src="/assets/images/logo_barber-l3-barberia-unisex.jpeg" 
          alt="Logo Nexus Barber L3 Barbería Unisex" 
          data-source-path="C:\Users\leola\Downloads\barber-l3\public\assets\images\logo_barber-l3-barberia-unisex.jpeg"
          className="w-24 h-24 object-contain rounded-full border-2 border-[#6A1B29] shadow-lg bg-white relative z-10"
        />
        <span className="mt-2 text-xs font-black tracking-widest text-[#6A1B29] uppercase font-mono block">
          Nexus Barber L3
        </span>
      </div>

      {/* CUERPO DE TEXTO CENTRAL: Tipografía Sans-Serif Black (Extra Bold) e Itálica */}
      <div className="px-6 py-2 relative z-10 flex-grow flex flex-col justify-center space-y-6 text-center box-border">
        {/* Slogan: Estilo itálico del flyer original */}
        <div>
          <span className="text-sm font-serif italic font-bold tracking-wide text-[#6A1B29] bg-white/90 px-3 py-1 rounded shadow-sm border border-[#6A1B29]/20 inline-block">
            “Tu imagen también es un proyecto”
          </span>
        </div>

        {/* Título: ¡INAUGURAMOS! en Sans-Serif Black (Extra Bold) */}
        <div>
          <h2 className="text-6xl font-black tracking-tighter text-black uppercase leading-none drop-shadow-sm font-sans">
            ¡INAUGURAMOS!
          </h2>
          <div className="w-16 h-1.5 bg-[#6A1B29] mx-auto mt-3 rounded-full" />
        </div>

        {/* Datos Logísticos de Convocatoria */}
        <div className="bg-white/95 p-4 border-2 border-[#6A1B29] shadow-md inline-block mx-auto max-w-[280px] w-full box-border">
          <span className="block text-[9px] text-[#6A1B29] uppercase tracking-widest font-mono font-bold mb-1">
            Cuándo & Dónde
          </span>
          <span className="text-xl font-black text-black block tracking-tight font-sans">
            Viernes 15, 18:00 hs
          </span>
          <span className="block text-xs font-bold text-zinc-800 mt-1 pt-1 border-t border-zinc-200 font-sans">
            San Miguel de Tucumán
          </span>
          <span className="block text-[10px] text-zinc-500 font-mono">
            Planta Baja - San Miguel de Tucumán
          </span>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <div className="p-6 pb-8 relative z-10 box-border">
        <div className="bg-[#6A1B29] text-white p-3 text-center shadow-md">
          <p className="text-xs font-bold tracking-wider uppercase font-mono">
            ¡Vení cuando quieras, te esperamos!
          </p>
        </div>
        
        <div className="mt-2 text-center text-[8px] text-zinc-500 font-mono tracking-widest uppercase">
          ACTIVO FÍSICO ENSAMBLADO // EXPORT: 390x844px JPG
        </div>
      </div>
    </div>
  );
}
