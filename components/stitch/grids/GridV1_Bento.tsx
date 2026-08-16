'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Quote } from 'lucide-react';

/**
 * GRID V1: BENTO BOX (ATÓMICO)
 * 
 * Componente Soberano de grilla asimétrica.
 * Ideal para mostrar "Lifestyle" y "Detalles".
 */

// Interfaces
interface BentoItem {
    image?: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    stat?: string;
    label?: string;
    quote?: string;
}

interface GridV1Props {
    title?: string;
    items?: BentoItem[];
    vibe?: string;
}

export const GridV1_Bento = ({ 
  title = "Nuestro Mundo", 
  items = [],
  vibe = '1'
}: GridV1Props) => {

  // Normalización de items (Relleno si faltan)
  const safeItems = [
      items[0] || { image: 'https://source.unsplash.com/random/800x800/?beauty', title: 'Experiencia' },
      items[1] || { title: 'Calidad Premium', description: 'Solo los mejores productos.', icon: <Sparkles /> },
      items[2] || { stat: '100%', label: 'Satisfacción' },
      items[3] || { image: 'https://source.unsplash.com/random/800x400/?salon', title: 'Ver Servicios' },
      items[4] || { image: 'https://source.unsplash.com/random/400x400/?nails' },
      items[5] || { quote: 'El detalle hace la diferencia.' }
  ];

  return (
    <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tighter text-gray-900"
            >
                {title}
            </motion.h2>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[300px] md:h-[800px]">
                
                {/* Item A (Large Square - Main Image) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 md:row-span-2 relative rounded-4xl overflow-hidden group shadow-xl"
                >
                    <img src={safeItems[0].image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                        <h3 className="text-white text-3xl font-bold tracking-tight">{safeItems[0].title}</h3>
                    </div>
                </motion.div>

                {/* Item B (Tall - Feature) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-1 md:row-span-2 relative rounded-4xl overflow-hidden group shadow-xl bg-white p-8 flex flex-col justify-between border border-gray-100"
                >
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        {safeItems[1].icon || <Sparkles size={24} />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-none">{safeItems[1].title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{safeItems[1].description}</p>
                    </div>
                </motion.div>

                {/* Item C (Small - Stat) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-4xl p-6 text-white flex flex-col justify-center items-center text-center shadow-xl"
                >
                    <h3 className="text-5xl font-black mb-1">{safeItems[2].stat}</h3>
                    <p className="text-sm opacity-60 uppercase tracking-widest font-bold">{safeItems[2].label}</p>
                </motion.div>

                {/* Item D (Wide - Link) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2 md:row-span-1 bg-white rounded-4xl p-6 flex items-center gap-6 shadow-xl border border-gray-100 group cursor-pointer hover:border-gray-300 transition-colors"
                >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-200">
                         {safeItems[3].image && <img src={safeItems[3].image} className="w-full h-full object-cover" alt="Link" />}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{safeItems[3].title}</h3>
                        <span className="text-gray-900 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Ver más <ArrowRight size={16} /></span>
                    </div>
                </motion.div>

                {/* Item E (Medium - Image) */}
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.4 }}
                     className="md:col-span-1 md:row-span-1 relative rounded-4xl overflow-hidden shadow-xl"
                >
                     <img src={safeItems[4].image} className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Detail" />
                </motion.div>

                {/* Item F (Text - Quote) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="md:col-span-1 md:row-span-1 bg-[#F5F5F0] rounded-4xl p-8 flex flex-col justify-center items-center text-center shadow-inner"
                >
                    <Quote className="text-gray-300 w-8 h-8 mb-2" />
                    <p className="text-gray-900 font-serif italic font-medium leading-tight">"{safeItems[5].quote}"</p>
                </motion.div>
            </div>
        </div>
    </section>
  );
};
