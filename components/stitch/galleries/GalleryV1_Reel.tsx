'use client';

import React from 'react';

/**
 * WIDGET: Gallery Reel (Infinite Scroll)
 * Enfoque: Logos de clientes, Tech Stack, Certificaciones.
 */

interface GalleryReelProps {
    title?: string;
    images?: string[];
    speed?: number; // seconds for full loop
    direction?: 'left' | 'right';
    grayscale?: boolean;
}

export const GalleryV1_Reel = ({
    title,
    images = [
        "https://via.placeholder.com/150x50?text=LOGO+1",
        "https://via.placeholder.com/150x50?text=LOGO+2",
        "https://via.placeholder.com/150x50?text=LOGO+3",
        "https://via.placeholder.com/150x50?text=LOGO+4",
        "https://via.placeholder.com/150x50?text=LOGO+5"
    ],
    speed = 20,
    direction = 'left',
    grayscale = true
}: GalleryReelProps) => {

    return (
        <section className="py-12 bg-black overflow-hidden relative border-y border-white/10">
            {title && (
                <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90 uppercase">{title}</h2>
                </div>
            )}
            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll ${speed}s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="flex gap-16 w-max animate-scroll">
                {/* Original Set */}
                {images.map((src, i) => (
                    <img 
                        key={`orig-${i}`} 
                        src={src} 
                        className={`h-16 md:h-24 object-contain transition-all duration-300 ${grayscale ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:scale-110'}`}
                        alt={`Logo ${i}`}
                    />
                ))}
                {/* Duplicate Set for Loop */}
                {images.map((src, i) => (
                    <img 
                        key={`dup-${i}`} 
                        src={src} 
                        className={`h-16 md:h-24 object-contain transition-all duration-300 ${grayscale ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:scale-110'}`}
                        alt={`Logo ${i}`}
                    />
                ))}
            </div>
        </section>
    );
};
