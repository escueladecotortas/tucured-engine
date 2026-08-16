'use client';

import React from 'react';

/**
 * FOOTER V1: MAP & CONTACT (ATÓMICO)
 * Componente Soberano para cierre de página con ubicación real.
 */

// Estilos Vibracionales (Fondos y Bordes)
const VIBE_FOOTER_STYLES = {
  '1': 'bg-neutral-900 border-t border-yellow-500/30',
  '2': 'bg-neutral-900 border-t border-emerald-500/30',
  '3': 'bg-neutral-900 border-t border-fuchsia-500/30',
  '4': 'bg-neutral-900 border-t border-blue-500/30',
  '5': 'bg-neutral-900 border-t border-purple-500/30',
  '6': 'bg-neutral-900 border-t border-pink-500/30',
  '7': 'bg-neutral-900 border-t border-indigo-500/30',
  '8': 'bg-neutral-900 border-t border-orange-500/30',
  '9': 'bg-neutral-900 border-t border-white/20',
};

export const FooterV1_Map = ({ 
  address = "Ubicación Pendiente", 
  phone = "Consulta",
  mapUrl = "", // URL embed de Google Maps
  vibe = '1'
}) => {
  const vibeClass = VIBE_FOOTER_STYLES[vibe] || VIBE_FOOTER_STYLES['1'];
  const currentYear = new Date().getFullYear();

  // Fallback map URL (Tucumán Center)
  const safeMapUrl = mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1524.8696087593282!2d-65.20718501170757!3d-26.83020613271708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad7f30f1d%3A0xf8606cd659b2e302!2sPlaza%20Independencia!5e0!3m2!1ses!2sar!4v1707000000000!5m2!1ses!2sar";

  return (
    <footer className={`relative py-16 ${vibeClass}`}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* COLUMNA 1: INFO & BRAND */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Contacto & Ubicación
          </h3>
          <div className="space-y-4 text-gray-400">
            <p className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              {address}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-xl">📱</span>
              {phone}
            </p>
          </div>
          <div className="pt-6 border-t border-white/10 text-sm text-gray-500">
            &copy; {currentYear} Todos los derechos reservados.
            <br />
            <span className="opacity-50">Powered by NEXUS-OS</span>
          </div>
        </div>

        {/* COLUMNA 2: MAPA SOBERANO (Iframe Seguro) */}
        <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
          <iframe 
            src={safeMapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          />
          {/* Overlay Vibe */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
        </div>

      </div>
    </footer>
  );
};
