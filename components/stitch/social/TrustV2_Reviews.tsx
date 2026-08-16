'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * WIDGET: General Reviews Carousel
 * Enfoque: Testimonios genéricos (Facebook, Etsy, Manuales).
 */

interface TrustProps {
    title?: string;
    primaryColor?: string;
}

export const TrustV2_Reviews = ({
    title = "Nuestros Clientes Hablan",
    primaryColor = "#3B82F6"
}: TrustProps) => {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">{title}</h2>
                
                <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory px-4 md:justify-center hide-scrollbar">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div 
                            key={i}
                            className="snap-center shrink-0 w-80 bg-gray-800 p-8 rounded-2xl relative"
                            whileHover={{ y: -5 }}
                        >
                            <div className="absolute -top-4 left-8 text-6xl opacity-30 font-serif" style={{ color: primaryColor }}>"</div>
                            <div className="flex gap-1 mb-4" style={{ color: primaryColor }}>
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                                <Star fill="currentColor" size={16} />
                            </div>
                            <p className="text-gray-300 italic mb-6">"El servicio fue impecable. Definitivamente volveremos a contratar. La atención al detalle marca la diferencia."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Cliente {i}</p>
                                    <p className="text-xs text-gray-500">CEO, Empresa {i}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
