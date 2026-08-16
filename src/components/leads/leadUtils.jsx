// ============================================
// LEAD UTILS - Utilidades y configuración para el sistema de leads
// Extraído de LeadGenerator.jsx
// ============================================

import { motion } from 'framer-motion';
import { Phone, Sparkles, CheckCircle, AlertTriangle, Target } from 'lucide-react';

/**
 * Configuración de estados para prospects
 */
export const STATUS_CONFIG = {
    new: {
        color: 'cyan',
        icon: Sparkles,
        label: 'New Lead',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400'
    },
    ready: {
        color: 'emerald',
        icon: CheckCircle,
        label: 'Ready to Generate',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400'
    },
    generating: {
        color: 'blue',
        icon: Sparkles,
        label: 'Generando...',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400'
    },
    incomplete_data: {
        color: 'yellow',
        icon: AlertTriangle,
        label: 'Incomplete Data',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400'
    },
    generated: {
        color: 'blue',
        icon: Sparkles,
        label: 'Site Generated',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400'
    },
    generated_no_deploy: {
        color: 'orange',
        icon: AlertTriangle,
        label: 'Site Generated (Local)',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400'
    },
    contacted: {
        color: 'purple',
        icon: Target,
        label: 'Contacted',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400'
    }
};

/**
 * Calcula el Lead Score basado en datos del prospect
 * @param {Object} lead - Datos del lead
 * @returns {number} Score de 0 a 100
 */
export const calculateLeadScore = (lead) => {
    let score = 50;

    // 1. Rating Impact 
    const rating = parseFloat(lead.rating?.replace(',', '.') || 0);
    if (rating >= 4.8) score += 30;
    else if (rating >= 4.5) score += 20;
    else if (rating >= 4.0) score += 10;
    else if (rating < 3.5) score -= 20;

    // 2. Reviews
    const reviews = parseInt(lead.reviews || 0, 10);
    if (reviews > 100) score += 15;
    else if (reviews > 50) score += 10;
    else if (reviews < 5) score -= 5;

    // 3. Contactability
    if (lead.phone) score += 5;

    // 4. Content 
    if ((lead.photos || 0) > 10) score += 5;

    return Math.min(Math.max(score, 0), 100);
};

/**
 * Normaliza número de teléfono argentino para WhatsApp
 * @param {string} phone - Número de teléfono sin formatear
 * @returns {string} Número normalizado para wa.me
 */
export const normalizeArgentinePhone = (phone) => {
    if (!phone) return null;

    let cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('549')) {
        // Ya está bien formateado
    } else if (cleanPhone.startsWith('54')) {
        cleanPhone = '549' + cleanPhone.slice(2);
    } else if (cleanPhone.startsWith('0')) {
        cleanPhone = '549' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('15')) {
        cleanPhone = '549381' + cleanPhone.slice(2);
    } else if (cleanPhone.length <= 10) {
        cleanPhone = '549' + cleanPhone;
    }

    return cleanPhone;
};

/**
 * CallToast - Toast de notificación de llamada activa
 */
export const CallToast = ({ isVisible, phone }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-6 right-6 z-[70] pointer-events-none">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-zinc-900 border border-indigo-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-sm"
            >
                <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute -top-1 -right-1" />
                    <div className="bg-indigo-500/20 p-3 rounded-full border border-indigo-500/30">
                        <Phone className="w-6 h-6 text-indigo-400" />
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">Llamada en Curso para Icaro</h4>
                    <p className="text-zinc-400 text-xs font-mono">Simulando conexión con {phone}...</p>
                </div>
            </motion.div>
        </div>
    );
};

/**
 * Información del banner beta
 */
export const INFO_BANNER = {
    title: "Lead Factory - Beta Version",
    functional: ["Generación automática de sitios", "Deploy a Netlify con URLs reales", "Numerología y branding inteligente"],
    comingSoon: ["Google Maps scraping", "Instagram data extraction", "Automated outreach (WhatsApp/Email)"]
};
