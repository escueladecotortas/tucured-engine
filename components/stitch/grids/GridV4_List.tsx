'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * WIDGET: Grid V4 (List/Menu)
 * Enfoque: Gastronomía, Listas de Precios, Servicios.
 */

interface ListItem {
    name: string;
    price: string;
    description: string;
    isNew?: boolean;
}

interface GridV4Props {
    title?: string;
    subtitle?: string;
    items?: ListItem[];
    ctaText?: string;
    ctaLink?: string;
    bgImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export const GridV4_List = ({
    title = "Nuestro Menú",
    subtitle = "Sabores únicos",
    items = [
        { name: "Opción Premium", price: "$12.000", description: "Descripción detallada del plato o servicio.", isNew: true },
        { name: "Opción Clásica", price: "$8.500", description: "El favorito de siempre." },
        { name: "Opción Light", price: "$9.200", description: "Liviano y saludable." }
    ],
    ctaText = "Ver Carta Completa",
    ctaLink = "#",
    bgImage = "https://www.transparenttextures.com/patterns/cubes.png", // Texture pattern
    primaryColor = "#1A1A1A",
    secondaryColor = "#FF2A2A"
}: GridV4Props) => {

    return (
        <section className="py-20 bg-fixed bg-gray-50" style={{ backgroundImage: `url('${bgImage}')` }}>
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl p-8 md:p-16"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif italic mb-2" style={{ color: primaryColor }}>{subtitle}</h2>
                        <h1 className="text-5xl font-bold text-gray-900">{title}</h1>
                        <div className="w-24 h-1 mx-auto mt-6" style={{ backgroundColor: primaryColor }}></div>
                    </div>

                    <div className="space-y-8">
                        {items.map((item, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between items-baseline border-b border-gray-200 pb-4 border-dotted group-hover:border-solid transition-all">
                                    <div className="flex gap-4 items-center">
                                        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                                        {item.isNew && (
                                            <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ backgroundColor: secondaryColor }}>NUEVO</span>
                                        )}
                                    </div>
                                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>{item.price}</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-2">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {ctaText && (
                        <div className="text-center mt-12">
                            <a 
                                href={ctaLink} 
                                className="inline-block px-10 py-4 text-white font-bold rounded hover:bg-black transition-colors shadow-lg hover:shadow-xl"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {ctaText}
                            </a>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};
