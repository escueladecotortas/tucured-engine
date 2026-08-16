// ============================================
// NEXUS-OS CORE COMPONENTS
// Componentes "de fierro" - Reutilizables y aprobados
// ============================================

import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard - Contenedor con efecto glassmorphism
 * @param {ReactNode} children - Contenido del card
 * @param {string} className - Clases adicionales
 * @param {boolean} hoverEffect - Activar efecto hover (default: true)
 */
export const GlassCard = ({ children, className = "", hoverEffect = true, ...props }) => (
    <motion.div
        {...props}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`
            relative overflow-hidden rounded-2xl 
            bg-white/3 backdrop-blur-xl 
            border-white/5 
            shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
            ${hoverEffect ? 'hover:bg-white/5 hover:border-white/10 transition-all duration-300' : ''}
            ${className}
        `}
    >
        {children}
    </motion.div>
);

/**
 * NavPill - Botón de navegación tipo pill
 * @param {Component} icon - Icono de lucide-react
 * @param {string} label - Texto del botón
 * @param {boolean} active - Estado activo
 * @param {function} onClick - Callback al hacer click
 * @param {string} colorClass - Clase de color cuando activo (default: text-indigo-400)
 */
export const NavPill = ({ icon: Icon, label, active, onClick, colorClass = "text-indigo-400" }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300
            ${active
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
        `}
    >
        <Icon className={`w-4 h-4 ${active ? colorClass : ''}`} />
        <span>{label}</span>
    </button>
);

/**
 * MetricItem - Componente para mostrar métricas con tendencia
 * @param {string} label - Etiqueta de la métrica
 * @param {string|number} value - Valor principal
 * @param {string} trend - Texto de tendencia (opcional)
 * @param {boolean} trendUp - Tendencia positiva o negativa
 */
export const MetricItem = ({ label, value, trend, trendUp }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mb-1">{label}</span>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white font-outfit">{value}</span>
            {trend && (
                <span className={`text-[10px] mb-1.5 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend}
                </span>
            )}
        </div>
    </div>
);

/**
 * StatusBadge - Badge para mostrar estados
 * @param {string} status - Estado (active, idle, pilot, error)
 * @param {string} label - Texto del badge (opcional, usa status si no se provee)
 */
export const StatusBadge = ({ status, label }) => {
    const styles = {
        active: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        idle: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        pilot: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        working: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
    };

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-medium ${styles[status] || styles.idle}`}>
            {label || status}
        </span>
    );
};

/**
 * ProgressBar - Barra de progreso animada sincronizada
 * @param {number} progress - Porcentaje de progreso (0-100)
 * @param {string} color - Color de la barra (tailwind class)
 * @param {boolean} animated - Si mostrar animación de pulso
 */
export const ProgressBar = ({ progress, color = 'bg-indigo-500', animated = true }) => (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full ${color} ${animated && progress < 100 ? 'animate-pulse' : ''} rounded-full`}
        />
    </div>
);

/**
 * Skeleton - Placeholder de carga
 * @param {string} className - Clases para dimensiones
 */
export const Skeleton = ({ className = "h-4 w-full" }) => (
    <div className={`bg-white/5 rounded animate-pulse ${className}`} />
);

/**
 * EmptyState - Estado vacío con ilustración
 * @param {Component} icon - Icono de lucide-react
 * @param {string} title - Título
 * @param {string} description - Descripción
 * @param {ReactNode} action - Botón o acción opcional
 */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center p-8">
        {Icon && <Icon className="w-16 h-16 text-gray-600" />}
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 max-w-md">{description}</p>
        {action}
    </div>
);

// Barrel export para import limpio
export default {
    GlassCard,
    NavPill,
    MetricItem,
    StatusBadge,
    ProgressBar,
    Skeleton,
    EmptyState
};
