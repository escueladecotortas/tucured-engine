// Archivo: frontend/src/components/core/TimelineProcess.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import TimelineStep from './timeline/TimelineStep';

// Hook re-exportado para conveniencia
export { useTimelineSteps } from '../../hooks/useTimelineSteps';

/**
 * TimelineProcess - Componente principal de timeline animada
 * Refactorizado para cumplir con la Ley de 200 líneas.
 * 
 * @param {Array} steps - Array de pasos [{id, title, description, status, agent, timestamp, progress, result}]
 * @param {string} title - Título opcional de la timeline
 * @param {boolean} compact - Modo compacto
 */
export default function TimelineProcess({ steps = [], title, compact = false }) {
    if (steps.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                No hay procesos activos
            </div>
        );
    }

    const completedCount = steps.filter(s => s.status === 'completed').length;
    const totalCount = steps.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    return (
        <div className={`${compact ? 'p-3' : 'p-6'} bg-white/5 rounded-xl border border-white/10`}>
            {/* Header with Progress */}
            {title && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: steps.some(s => s.status === 'active') ? 360 : 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                            <Loader2 className={`w-4 h-4 ${steps.some(s => s.status === 'active') ? 'text-indigo-400' : 'text-gray-600'}`} />
                        </motion.div>
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-mono text-gray-500">
                            {completedCount}/{totalCount}
                        </div>
                        <div className="w-16 h-1.5 progress-track">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline Steps */}
            <AnimatePresence>
                <div className="space-y-0">
                    {steps.map((step, index) => (
                        <TimelineStep
                            key={step.id || index}
                            step={step}
                            index={index}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}
