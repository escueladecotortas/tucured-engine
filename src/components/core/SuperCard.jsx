// Archivo: frontend/src/components/core/SuperCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Sub-componentes Atómicos (Ley de 200 líneas)
import CardViewport from './supercard/CardViewport';
import MetricsGrid from './supercard/MetricsGrid';
import ActivityTicker from './supercard/ActivityTicker';

/**
 * SuperCard: Componente híbrido de visualización de clientes (NEXUS v3)
 * Refactorizado para cumplir con la Ley de 200 líneas.
 */
export default function SuperCard({ client, onClick, onDelete, viewMode = 'grid' }) {
    // Determina el color de marca para las animaciones
    const getBrandColor = (gradientClass) => {
        if (!gradientClass) return 'indigo';
        const colors = ['rose', 'pink', 'amber', 'orange', 'emerald', 'teal', 'cyan', 'blue'];
        for (const color of colors) {
            if (gradientClass.includes(color)) return color === 'pink' ? 'rose' : (color === 'orange' ? 'amber' : (color === 'teal' ? 'emerald' : (color === 'blue' ? 'cyan' : color)));
        }
        return 'indigo';
    };

    const brandColor = getBrandColor(client.color);

    // Variantes de animación de "Respiración" (Breathing UI)
    const breathingVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        zen: {
            opacity: 1,
            scale: 1,
            boxShadow: `0 0 0 1px rgba(${brandColor === 'rose' ? '244,63,94' : '99,102,241'}, 0.1)`,
            transition: {
                boxShadow: { duration: 4, repeat: Infinity, repeatType: "mirror" },
                default: { duration: 0.5 }
            }
        },
        active: {
            opacity: 1,
            scale: 1,
            boxShadow: [`0 0 0 2px rgba(${brandColor === 'rose' ? '244,63,94' : '99,102,241'}, 0.6)`, `0 0 30px 5px rgba(${brandColor === 'rose' ? '244,63,94' : '99,102,241'}, 0.3)`],
            transition: {
                boxShadow: { duration: 1.5, repeat: Infinity, repeatType: "mirror" },
                default: { duration: 0.5 }
            }
        }
    };

    return (
        <motion.div
            layout
            initial="hidden"
            whileHover={{ y: -4, scale: 1.01 }}
            variants={breathingVariants}
            animate={client.status === 'active' ? 'active' : 'zen'}
            onClick={onClick}
            className={`
                group relative bg-[#0B0F19] border border-white/10 rounded-xl overflow-hidden cursor-pointer flex flex-col
                ${viewMode === 'list' ? 'flex-row h-24 items-center' : 'h-[420px]'} 
            `}
        >
            {/* 1. IDENTITY HEADER */}
            <div className={`relative h-1.5 w-full bg-linear-to-r ${client.color || 'from-indigo-500 to-violet-600'}`} />

            {/* 2. THE VIEWPORT (Live Reality Window) */}
            <CardViewport 
                client={client} 
                viewMode={viewMode} 
                onDelete={onDelete} 
            />

            {/* 3. INFORMATION LAYER */}
            <div className={`flex flex-col flex-1 ${viewMode === 'list' ? 'px-4' : 'p-4'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white font-bold tracking-tight text-lg leading-tight group-hover:text-indigo-400 transition-colors">
                            {client.name}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium">{client.industry || 'Tech / Digital'}</p>
                    </div>
                </div>

                {/* Métricas y Datos Core */}
                <MetricsGrid client={client} viewMode={viewMode} />

                {/* 4. THE TICKER (Real Data) */}
                <ActivityTicker client={client} />
            </div>

            {/* List Mode Extras */}
            {viewMode === 'list' && (
                <div className="pr-6 flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-[9px] text-gray-500 uppercase">Agents</span>
                        <span className="text-white font-mono">{client.activeAgents || 1}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
            )}
        </motion.div>
    );
}
