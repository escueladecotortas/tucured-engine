'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * PRODUCT CARD (ATÓMICO)
 * Sub-componente reutilizable para GridV5.
 */

// Lógica de Vibración interna (Bordes/Sombras)
const VIBE_CARD_STYLES = {
  '1': 'hover:shadow-yellow-500/20 hover:border-yellow-500/50',
  '2': 'hover:shadow-emerald-500/20 hover:border-emerald-500/50',
  '3': 'hover:shadow-fuchsia-500/20 hover:border-fuchsia-500/50',
  '4': 'hover:shadow-blue-500/20 hover:border-blue-500/50',
  '5': 'hover:shadow-purple-500/20 hover:border-purple-500/50',
  '6': 'hover:shadow-pink-500/20 hover:border-pink-500/50',
  '7': 'hover:shadow-indigo-500/20 hover:border-indigo-500/50',
  '8': 'hover:shadow-orange-500/20 hover:border-orange-500/50',
  '9': 'hover:shadow-white/20 hover:border-white/50',
};

export const ProductCard = ({ item, vibe = '1', index = 0 }) => {
  const vibeClass = VIBE_CARD_STYLES[vibe] || VIBE_CARD_STYLES['1'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${vibeClass}`}
    >
      {/* IMAGEN */}
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <img 
          src={item.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'} 
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Etiqueta de Precio Flotante */}
        {item.price && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white text-sm font-bold px-3 py-1 rounded-full border border-white/20">
            ${parseInt(item.price).toLocaleString()}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
          {item.name || 'Producto Sin Nombre'}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {item.description || 'Descripción breve del producto disponible.'}
        </p>
        
        {/* BOTÓN */}
        <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/5">
          Ver Detalles
        </button>
      </div>
    </motion.div>
  );
};
