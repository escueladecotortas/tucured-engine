'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * WIDGET: Hero V3 (Minimal)
 * Enfoque: Tipografía, Mensaje Claro, Sin Distracciones.
 */

interface HeroV3Props {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export const HeroV3_Minimal = ({
    title = "Menos es Más.",
    subtitle = "La elegancia de la simplicidad para marcas que no necesitan gritar.",
    ctaText = "Contactar",
    ctaLink = "#contact",
    backgroundColor = "#F5F5F0", // Default: Off-white
    textColor = "#1A1A1A",
    accentColor = "#FF2A2A"
}: HeroV3Props) => {

    return (
        <section 
            className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6 py-20 relative overflow-hidden"
            style={{ backgroundColor: backgroundColor, color: textColor }}
        >
            {/* Background Texture (Subtle Noise or Gradient) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight"
                >
                    {title}
                </motion.h1>

                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-2 w-24 mx-auto mb-8"
                    style={{ backgroundColor: accentColor }}
                />

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xl md:text-2xl font-light opacity-80 mb-12 max-w-2xl mx-auto"
                >
                    {subtitle}
                </motion.p>

                <motion.a 
                    href={ctaLink}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="inline-block px-10 py-4 border-2 font-bold tracking-widest text-sm uppercase hover:bg-black hover:text-white transition-all duration-300"
                    style={{ borderColor: textColor, color: textColor }}
                >
                    {ctaText}
                </motion.a>
            </div>
        </section>
    );
};
