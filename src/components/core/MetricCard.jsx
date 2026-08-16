// ============================================
// METRIC CARD - Tarjeta de métrica con micro-animación
// Visualización de datos numéricos con tendencias
// @Atenea - Diseño
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * AnimatedNumber - Número que anima desde 0 hasta el valor final
 */
const AnimatedNumber = ({ value, duration = 1 }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        let startTime;
        const startValue = 0;
        const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(startValue + (endValue - startValue) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <>{displayValue.toLocaleString()}</>;
};

/**
 * TrendIndicator - Indicador de tendencia
 */
const TrendIndicator = ({ trend, value }) => {
    if (!trend || trend === 'neutral') {
        return (
            <div className="flex items-center gap-1 text-xs text-gray-500">
                <Minus className="w-3 h-3" />
                <span>Sin cambios</span>
            </div>
        );
    }

    const isPositive = trend === 'up';
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-emerald-400' : 'text-red-400';
    const bgClass = isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';

    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bgClass}`}>
            <Icon className={`w-3 h-3 ${colorClass}`} />
            <span className={`text-xs font-medium ${colorClass}`}>
                {value}%
            </span>
        </div>
    );
};

/**
 * MetricCard - Tarjeta de métrica con animación
 * 
 * @param {string} title - Título de la métrica
 * @param {number|string} value - Valor numérico
 * @param {string} unit - Unidad (%, €, etc)
 * @param {string} trend - 'up' | 'down' | 'neutral'
 * @param {number} trendValue - Porcentaje de cambio
 * @param {React.Component} icon - Icono de Lucide
 * @param {string} colorClass - Clase de color (text-cyan-400, etc)
 * @param {string} description - Descripción adicional
 */
export default function MetricCard({
    title,
    value,
    unit = '',
    trend,
    trendValue,
    icon: Icon,
    colorClass = 'text-indigo-400',
    description
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                            <Icon className={`w-4 h-4 ${colorClass}`} />
                        </div>
                    )}
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                        {title}
                    </span>
                </div>
                <TrendIndicator trend={trend} value={trendValue} />
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">
                    <AnimatedNumber value={value} />
                </span>
                {unit && (
                    <span className={`text-lg ${colorClass}`}>{unit}</span>
                )}
            </div>

            {/* Description */}
            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}

            {/* Subtle progress bar */}
            <div className="mt-3 h-0.5 progress-track opacity-50">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colorClass.includes('cyan') ? '#22D3EE' : '#818CF8'}, transparent)` }}
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </div>
        </motion.div>
    );
}

/**
 * MetricGrid - Grid de métricas
 */
export function MetricGrid({ metrics = [], columns = 4 }) {
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4`}>
            {metrics.map((metric, index) => (
                <motion.div
                    key={metric.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <MetricCard {...metric} />
                </motion.div>
            ))}
        </div>
    );
}
