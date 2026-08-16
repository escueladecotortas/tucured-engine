'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

/**
 * WIDGET: Sales Notification (FOMO)
 * Enfoque: Prueba social en tiempo real (simulada).
 */

const FAKE_SALES = [
    { name: "Juan P.", location: "Tucumán", product: "Pack Semilla", time: "hace 5 min" },
    { name: "Maria L.", location: "Yerba Buena", product: "Turno Estética", time: "hace 12 min" },
    { name: "Carlos R.", location: "Concepción", product: "Batería 60A", time: "hace 2 min" }
];

export const PowerUpV2_Notification = () => {
    const [current, setCurrent] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Ciclo de notificaciones
        const cycle = () => {
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    setCurrent(prev => (prev + 1) % FAKE_SALES.length);
                    cycle();
                }, 5000 + Math.random() * 5000); // Wait random time before next
            }, 6000); // Show for 6s
        };

        const timer = setTimeout(cycle, 2000); // Start delay
        return () => clearTimeout(timer);
    }, []);

    const sale = FAKE_SALES[current];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 left-6 z-40 bg-white rounded-xl shadow-2xl p-4 flex items-center gap-4 border border-gray-100 max-w-sm"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-800">
                            <span className="font-bold">{sale.name}</span> de {sale.location}
                        </p>
                        <p className="text-xs text-gray-500">
                            Compró <span className="text-[var(--primary)] font-bold">{sale.product}</span> <br/>
                            {sale.time}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
