'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * HERO V5: VIDEO IMPACT (ATÓMICO)
 * 
 * Componente Soberano de Alto Impacto.
 * Soporta inyección de "Vibra" (Atmósfera) desde StitchFactory.
 */

// Lógica de Vibración (Mapas de Estilo)
const VIBE_STYLES = {
  '1': { badge: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' }, // Poder
  '8': { badge: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  '2': { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }, // Vínculo
  '6': { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  '3': { badge: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' }, // Disrupción
  '5': { badge: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' },
  '9': { badge: 'bg-white/10 text-white border-white/20' }, // Lujo
  '7': { badge: 'bg-white/10 text-white border-white/20' },
  '4': { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }, // Estructura
};

export const HeroV5_Video = ({ 
  title = "Título Pendiente", 
  subtitle = "Subtítulo de alto impacto.",
  badge = "NUEVO",
  videoUrl,
  vibe = '1'
}) => {
  const styles = VIBE_STYLES[vibe] || VIBE_STYLES['1'];

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* CAPA 1: VIDEO DE FONDO */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
           <video autoPlay loop muted playsInline className="w-full h-full object-cover">
             <source src={videoUrl} type="video/mp4" />
           </video>
        ) : (
           <div className="w-full h-full bg-neutral-900" />
        )}
        
        {/* CAPA 2: ATMÓSFERA (Dimmer + Color) */}
        <div className="absolute inset-0 bg-black/40" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent`} />
      </div>

      {/* CAPA 3: CONTENIDO SOBERANO */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        
        {/* Badge Vibracional */}
        {badge && (
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block py-1 px-4 rounded-full text-sm font-bold tracking-widest backdrop-blur-md border ${styles.badge} mb-6 uppercase`}
          >
            {badge}
          </motion.span>
        )}

        {/* Códice Textual (Sacred Source) */}
        <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl"
        >
          {title}
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

      </div>
    </section>
  );
};
