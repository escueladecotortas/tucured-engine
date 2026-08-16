// ============================================
// OUTREACH MODAL - Modal de estrategia de contacto WhatsApp
// Extraído de LeadGenerator.jsx
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

/**
 * Templates de mensajes para outreach
 */
export const OUTREACH_TEMPLATES = [
    {
        id: 'value_prop',
        label: '💎 Propuesta de Valor',
        text: "Hola {name}, vi que tienen excelentes calificaciones en Maps pero no encontré su página web. ¿Les gustaría ver una demo de cómo quedaría su sitio?"
    },
    {
        id: 'soft_intro',
        label: '👋 Presentación Suave',
        text: "Hola {name}, buenos días! Mi nombre es Icaro de Tucu Red. Estamos digitalizando los mejores negocios de la zona y nos encantaría incluir el suyo. ¿Le puedo compartir más info?"
    },
    {
        id: 'competitor',
        label: '🚀 Competencia / Urgencia',
        text: "Hola {name}, notamos que varios negocios del rubro {category} en su zona ya están lanzando sus sitios web. Me gustaría mostrarle cómo puede destacar el suyo. ¿Le interesa ver una demo rápida?"
    }
];

/**
 * OutreachModal - Modal para seleccionar estrategia de contacto
 * 
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Callback para cerrar
 * @param {function} onSend - Callback para enviar mensaje (recibe el mensaje final)
 * @param {Object} prospect - Prospect objetivo
 */
export default function OutreachModal({ isOpen, onClose, onSend, prospect }) {
    const [selectedTemplate, setSelectedTemplate] = useState('value_prop');

    if (!isOpen || !prospect) return null;

    const currentTemplate = OUTREACH_TEMPLATES.find(t => t.id === selectedTemplate);
    const messagePreview = currentTemplate?.text
        .replace('{name}', prospect.name)
        .replace('{category}', prospect.category || 'su rubro');

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />

                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Seleccionar Estrategia
                </h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-2">Template</label>
                        <div className="grid gap-2">
                            {OUTREACH_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`text-left p-3 rounded-lg border transition-all ${selectedTemplate === t.id
                                        ? 'bg-purple-500/20 border-purple-500 text-white'
                                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                                        }`}
                                >
                                    <div className="font-bold text-sm mb-0.5">{t.label}</div>
                                    <div className="text-xs opacity-70 line-clamp-2 overflow-hidden">{t.text}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-2">Vista Previa</label>
                        <div className="bg-black/50 border border-white/5 rounded-lg p-4 text-sm text-zinc-300 italic">
                            "{messagePreview}"
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium border border-white/5"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSend(messagePreview)}
                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors font-bold shadow-lg shadow-purple-500/20"
                    >
                        Enviar WhatsApp 🚀
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
