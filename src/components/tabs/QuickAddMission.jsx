// Archivo: src/components/tabs/QuickAddMission.jsx
// Creador de Misiones con Plantillas del Embudo Comercial y Análisis Heurístico

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, Search, Palette, Rocket, MessageSquare } from 'lucide-react';
import { PRIORITY_CONFIG, AGENTS } from './missions-config';

const FUNNEL_TEMPLATES = [
  {
    id: 'scraping',
    icon: Search,
    title: 'Scraping de Zona y Prospección',
    desc: 'Extracción de 20 comercios en Tucumán (Gastronomía/Estética).',
    agent: 'icaro',
    priority: 'high',
    automationType: 'ai_action',
    requiresTokens: true
  },
  {
    id: 'stitch',
    icon: Palette,
    title: 'Generar Demo Stitch de Alta Conversión',
    desc: 'Ensamble de landing demo con Stitch Showroom y tokens visuales.',
    agent: 'atenea',
    priority: 'critical',
    automationType: 'system_action',
    requiresTokens: false
  },
  {
    id: 'deploy',
    icon: Rocket,
    title: 'Deploy en Subdominio y Auditoría Biónica',
    desc: 'Publicación de preview y verificación biónica de accesibilidad.',
    agent: 'argus',
    priority: 'high',
    automationType: 'system_action',
    requiresTokens: false
  },
  {
    id: 'closing',
    icon: MessageSquare,
    title: 'Propuesta Comercial y Cierre WhatsApp',
    desc: 'Redacción de propuesta comercial personalizada con enlace demo.',
    agent: 'lorem',
    priority: 'medium',
    automationType: 'ai_action',
    requiresTokens: true
  }
];

export default function QuickAddMission({ onAdd, onCancel }) {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState({ priority: 'medium', agent: null, detectedType: 'generic', isAutomation: false, reqTokens: false });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setAnalysis({ priority: 'medium', agent: null, detectedType: 'generic' });
        return;
      }
      setIsAnalyzing(true);
      const text = input.toLowerCase();
      let priority = 'medium';
      if (text.includes('urgente') || text.includes('crítico')) priority = 'critical';
      else if (text.includes('importante') || text.includes('alta')) priority = 'high';

      let agent = null;
      if (text.includes('código') || text.includes('bug')) agent = 'codi';
      else if (text.includes('diseño') || text.includes('demo') || text.includes('stitch')) agent = 'atenea';
      else if (text.includes('copy') || text.includes('whatsapp') || text.includes('propuesta')) agent = 'lorem';
      else if (text.includes('leads') || text.includes('scraping') || text.includes('prospectos')) agent = 'icaro';
      else if (text.includes('qa') || text.includes('biónica') || text.includes('test')) agent = 'argus';

      setTimeout(() => {
        setAnalysis({ priority, agent, detectedType: 'generic', isAutomation: false, reqTokens: false });
        setIsAnalyzing(false);
      }, 300);
    }, 400);
    return () => clearTimeout(timer);
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd({
      title: input.split('\n')[0].substring(0, 60),
      description: input,
      priority: analysis.priority,
      assignedTo: analysis.agent || 'nexus',
      status: 'pending'
    });
    setInput('');
  };

  const handleApplyTemplate = (tpl) => {
    onAdd({
      title: tpl.title,
      description: tpl.desc,
      priority: tpl.priority,
      assignedTo: tpl.agent,
      status: 'pending',
      automationType: tpl.automationType,
      requiresTokens: tpl.requiresTokens
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 space-y-4 font-mono">
      {/* Plantillas Rápidas del Embudo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {FUNNEL_TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          const prio = PRIORITY_CONFIG[tpl.priority];
          return (
            <button
              key={tpl.id}
              onClick={() => handleApplyTemplate(tpl)}
              className="p-3 bg-[#0A0A1A]/80 hover:bg-indigo-950/40 border border-white/10 hover:border-indigo-500/50 rounded-xl text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border border-${prio.color}-500/30 bg-${prio.color}-500/10 text-${prio.color}-400`}>
                  {prio.label}
                </span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">{tpl.title}</h5>
                <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{tpl.desc}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                <span>@{tpl.agent}</span>
                <span className="text-indigo-400 font-bold group-hover:underline">+ Instanciar</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input Libre en Lenguaje Natural */}
      <form onSubmit={handleSubmit} className="bg-[#0A0A1A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAnalyzing ? 'ANALIZANDO CONTEXTO...' : 'NUEVA MISIÓN PERSONALIZADA'}</span>
          </div>
          <span>Prioridad inferida: <strong className="text-white">{analysis.priority}</strong></span>
        </div>
        <div className="p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu misión (ej: 'Ícaro, prospectar 15 gimnasios en Yerba Buena')..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
          />
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white">Cancelar</button>
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-900/20"
          >
            <Zap className="w-3 h-3" /> Crear
          </button>
        </div>
      </form>
    </motion.div>
  );
}
