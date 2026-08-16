// Archivo: frontend/src/components/tabs/QuickAddMission.jsx
// Formulario inteligente con análisis heurístico de contexto para nuevas misiones.
// Extraído del monolito MissionsTab.jsx — Ley de 200 Líneas 2026.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, User } from 'lucide-react';
import { PRIORITY_CONFIG, AGENTS } from './missions-config';

/**
 * QuickAddMission — Formulario de alta de misión con análisis heurístico de intención.
 */
const QuickAddMission = ({ onAdd, onCancel }) => {
    const [input, setInput] = useState('');
    const [analysis, setAnalysis] = useState({ priority: 'medium', agent: null, detectedType: 'generic', isAutomation: false, reqTokens: false });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Análisis heurístico con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!input.trim()) {
                setAnalysis({ priority: 'medium', agent: null, detectedType: 'generic' });
                return;
            }
            setIsAnalyzing(true);
            const text = input.toLowerCase();

            // Lógica de prioridad
            let priority = 'medium';
            if (text.includes('urgente') || text.includes('crítico') || text.includes('error fatal')) priority = 'critical';
            else if (text.includes('importante') || text.includes('prioridad')) priority = 'high';
            else if (text.includes('cuando puedas') || text.includes('baja')) priority = 'low';

            // Lógica de agente
            let agent = null;
            if (text.includes('código') || text.includes('bug') || text.includes('react') || text.includes('api')) agent = 'codi';
            else if (text.includes('diseño') || text.includes('logo') || text.includes('color')) agent = 'atenea';
            else if (text.includes('copy') || text.includes('texto') || text.includes('redacción')) agent = 'lorem';
            else if (text.includes('ventas') || text.includes('growth') || text.includes('marketing')) agent = 'icaro';
            else if (text.includes('test') || text.includes('qa') || text.includes('prueba')) agent = 'argus';

            // Lógica de automatización
            let isAutomation = false, reqTokens = false, detectedType = 'generic';
            if (text.includes('sincronizar') || text.includes('backup') || text.includes('desplegar') || text.includes('deploy')) {
                isAutomation = true; detectedType = 'system_action';
            } else if (text.includes('redactar') || text.includes('generar') || text.includes('analizar') || text.includes('auditar')) {
                isAutomation = true; reqTokens = true; detectedType = 'ai_action';
            }

            setTimeout(() => {
                setAnalysis({ priority, agent, detectedType, isAutomation, reqTokens });
                setIsAnalyzing(false);
            }, 600);
        }, 800);
        return () => clearTimeout(timer);
    }, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const lines = input.split('\n');
        const title = lines[0].length > 50 ? lines[0].substring(0, 50) + '...' : lines[0];
        onAdd({
            title,
            description: input.length > title.length ? input : '',
            priority: analysis.priority,
            assignedTo: analysis.agent,
            status: 'pending',
            aiGenerated: true,
            ...(analysis.isAutomation ? { automationType: analysis.detectedType, requiresTokens: analysis.reqTokens } : {})
        });
        setInput('');
    };

    const priorityConfig = PRIORITY_CONFIG[analysis.priority];
    const agentConfig = AGENTS.find(a => a.id === analysis.agent);

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 relative group">
            <div className={`absolute -inset-0.5 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur duration-1000 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            <form onSubmit={handleSubmit} className="relative bg-[#0A0A1A] border border-white/10 rounded-xl p-0 overflow-hidden shadow-2xl">
                {/* Header con indicadores de análisis */}
                <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between min-h-[40px]">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-mono text-indigo-300 tracking-wider">
                            {isAnalyzing ? 'ANALIZANDO CONTEXTO...' : 'ASISTENTE IA LISTO'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <AnimatePresence>
                            <motion.span key={analysis.priority} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-${priorityConfig.color}-500/10 text-${priorityConfig.color}-400 border-${priorityConfig.color}-500/20 lowercase`}>
                                <priorityConfig.icon className="w-3 h-3" /> {priorityConfig.label}
                            </motion.span>
                            {agentConfig && (
                                <motion.span key={analysis.agent} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-${agentConfig.color}-500/10 text-${agentConfig.color}-400 border-${agentConfig.color}-500/20 lowercase`}>
                                    <User className="w-3 h-3" /> @{agentConfig.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                {/* Área de texto principal */}
                <div className="p-4">
                    <textarea value={input} onChange={e => setInput(e.target.value)} rows={2} autoFocus
                        placeholder="Escribe tu misión en lenguaje natural (ej: 'Codi, necesito arreglar crítico el login')..."
                        className="w-full bg-transparent text-lg text-white placeholder-gray-600 focus:outline-none resize-none font-light"
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }} />
                </div>
                {/* Controles inferiores */}
                <div className="px-4 py-3 bg-white/2 flex justify-between items-center">
                    <button type="button" onClick={onCancel}
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                        <span>ESC</span> Cancelar
                    </button>
                    <button type="submit" disabled={!input.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20">
                        <Zap className="w-3 h-3 fill-current" /> INICIAR MISIÓN
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default QuickAddMission;
