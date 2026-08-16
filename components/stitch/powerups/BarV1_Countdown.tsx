'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Clock } from 'lucide-react';

/**
 * POWER-UP: BAR V1 (COUNTDOWN)
 * Barra de urgencia fija en bottom/top con cuenta regresiva.
 */

interface BarV1Props {
    text?: string;
    ctaText?: string;
    targetDate?: Date; // Fecha límite real
    hoursDuration?: number; // O duración simulada en horas
    ctaLink?: string;
    startHidden?: boolean;
}

export const BarV1_Countdown = ({
    text = "¡OFERTA RELÁMPAGO! SOLO POR TIEMPO LIMITADO",
    ctaText = "VER DESCUENTOS",
    hoursDuration = 24,
    ctaLink = "#specials",
    startHidden = false
}: BarV1Props) => {

    const [isVisible, setIsVisible] = useState(!startHidden);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    // Inicializar fecha límite (Simulada para demo)
    // En prod idealmente vendría de una prop 'targetDate' fija del servidor
    useEffect(() => {
        // Simulación: Guardamos la fecha fin en localStorage para persistencia
        let target = localStorage.getItem('stitch_promo_deadline');
        
        if (!target) {
            const now = new Date();
            const deadline = new Date(now.getTime() + hoursDuration * 60 * 60 * 1000);
            target = deadline.toISOString();
            localStorage.setItem('stitch_promo_deadline', target);
        }

        const deadline = new Date(target);

        const timer = setInterval(() => {
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();

            if (diff <= 0) {
                setIsVisible(false);
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / 1000 / 60) % 60),
                s: Math.floor((diff / 1000) % 60)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hoursDuration]);

    const handleScroll = () => {
        const element = document.querySelector(ctaLink);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 w-full z-50 bg-linear-to-r from-red-600 to-orange-500 text-white shadow-2xl safe-area-bottom"
            >
                <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 relative">
                    
                    {/* Text */}
                    <div className="flex items-center gap-2 animate-pulse">
                        <Flame size={20} className="text-yellow-300 fill-yellow-300" />
                        <span className="font-bold uppercase tracking-wider text-xs md:text-sm">{text}</span>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-1 font-mono text-lg font-black bg-white/20 px-4 py-1 rounded-lg backdrop-blur-sm shadow-inner cursor-default select-none transition-all hover:bg-white/30 hover:scale-105">
                        <Clock size={16} className="mr-2 opacity-50"/> 
                        <span>{String(timeLeft.h).padStart(2, '0')}</span><span className="text-xs opacity-50 relative top-px">h</span> : 
                        <span>{String(timeLeft.m).padStart(2, '0')}</span><span className="text-xs opacity-50 relative top-px">m</span> : 
                        <span>{String(timeLeft.s).padStart(2, '0')}</span><span className="text-xs opacity-50 relative top-px">s</span>
                    </div>

                    {/* CTA */}
                    <button 
                        onClick={handleScroll}
                        className="bg-white text-red-600 px-6 py-2 rounded-full font-bold text-xs md:text-sm hover:cursor-pointer hover:bg-gray-100 hover:scale-105 transition-all shadow-lg active:scale-95"
                    >
                        {ctaText}
                    </button>

                    {/* Close */}
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 md:relative md:top-auto md:right-auto md:ml-4 opacity-50 hover:cursor-pointer hover:opacity-100 p-1 hover:bg-white/20 rounded-full transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
