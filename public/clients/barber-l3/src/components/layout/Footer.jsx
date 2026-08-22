// Archivo: src/components/layout/Footer.jsx
"use client";
import React, { useState, useEffect } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  // Escudo protector contra Hydration Mismatch en entornos móviles/simuladores
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // No renderiza nada en el servidor hasta estar seguro en el cliente
  }

  return (
    <footer className="w-full bg-[#FAF9F6] pb-12 px-4 sm:px-6 lg:px-8 font-sans text-neutral-500">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Bloque 01: Horarios de Atención General */}
        <div className="w-full bg-white border border-neutral-200/60 p-6 text-center rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <h4 className="text-[11px] font-bold text-neutral-800 uppercase tracking-[0.2em] mb-2 font-hanken">
            HORARIOS DE ATENCIÓN GENERAL
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Lunes a Viernes de 10:00 a 20:00 hs | Sábados de 10:00 a 14:00 hs
          </p>
        </div>

        {/* Bloque 02: Eje de Datos y Redes en una Sola Línea */}
        <div className="pt-6 border-t border-neutral-200/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          
          {/* Dirección e Información Local */}
          <div className="text-left space-y-1">
            <span className="block font-bold text-neutral-800 uppercase tracking-wider">Nexus Barber L3</span>
            <p className="text-neutral-500 tracking-wide font-light">
              Av. Int. Güiraldes 2160 Pabellón 3, Planta Baja, San Miguel de Tucumán, CABA
            </p>
          </div>

          {/* Enlaces Limpios a Redes Sociales */}
          <div className="flex items-center gap-4 text-neutral-600 font-medium tracking-wide">
            <a 
              href="https://wa.me/5491134294848" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#800000] transition-colors"
            >
              WhatsApp
            </a>
            <span className="text-neutral-300">|</span>
            <a 
              href="https://www.instagram.com/lafachadabarberia/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#800000] transition-colors"
            >
              Instagram
            </a>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-400 font-light text-[9px] tracking-widest">
              V11.41-REAL-DEPLOY
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}