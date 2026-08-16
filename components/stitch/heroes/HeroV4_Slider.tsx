'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * WIDGET: Hero V4 (Slider)
 * Enfoque: Visual Storytelling, Multiple Messages.
 */

interface Slide {
    id: string;
    image: string;
    title: string;
    description: string;
    cta?: string;
}

interface HeroV4Props {
    items?: Slide[];
    slides?: Slide[]; // Alias for backward compatibility/stale types
    interval?: number; // seconds
}

export const HeroV4_Slider = ({
    items,
    slides,
    interval = 5
}: HeroV4Props) => {
    // Standardize source data
    const activeItems = items || slides || [
        { id: '1', image: 'https://source.unsplash.com/random/1920x1080/?architecture', title: 'Diseño Moderno', description: 'Espacios que inspiran vida.' },
        { id: '2', image: 'https://source.unsplash.com/random/1920x1080/?interior', title: 'Confort Absoluto', description: 'Cada detalle pensado para vos.' },
        { id: '3', image: 'https://source.unsplash.com/random/1920x1080/?light', title: 'Iluminación Natural', description: 'La luz como protagonista.' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, interval * 1000);
        return () => clearInterval(timer);
    }, [currentIndex, interval, activeItems.length]); // Added activeItems.length safely

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
    };

    return (
        <section className="relative h-[80vh] w-full overflow-hidden bg-black text-white">
            
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activeItems[currentIndex].image})` }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Labels */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center px-4 max-w-4xl">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg tracking-tight">{activeItems[currentIndex].title}</h2>
                            <p className="text-xl md:text-2xl opacity-90 font-light drop-shadow-md">{activeItems[currentIndex].description}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all z-20 pointer-events-auto">
                <ChevronLeft size={32} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all z-20 pointer-events-auto">
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {activeItems.map((_: Slide, idx: number) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 pointer-events-auto ${idx === currentIndex ? 'w-12 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
            </div>

        </section>
    );
};
