'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard'; // Importación Atómica

/**
 * GRID V5: PRODUCTS (ATÓMICO)
 * Componente Soberano para exhibición de productos/servicios.
 * Usa sub-componente para mantener atomicidad.
 */

/**
 * @typedef {Object} ProductItem
 * @property {string} name
 * @property {string} price
 * @property {string} [description]
 * @property {string} [image]
 */

export const GridV5_Products = ({ 
  title = "Nuestros Productos", 
  subtitle = "Calidad garantizada en cada detalle.",
  /** @type {ProductItem[]} */
  items = [],
  vibe = '1'
}) => {
  // Fallback si no hay items
  const displayItems = items.length > 0 ? items : Array(4).fill({ 
    name: 'Producto Demo', 
    price: '10000', 
    image: null 
  });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* GRID ATÓMICO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((item, idx) => (
            <ProductCard 
              key={idx} 
              item={item} 
              vibe={vibe} 
              index={idx} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};
