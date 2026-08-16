import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Zap, Rocket, Hexagon, Star, Activity, Palette } from 'lucide-react';
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';

// Archetype Templates
const ARCHETYPES = [
    { id: 'nexus', role: 'Sistema Operativo', icon: 'hexagon', color: '#06b6d4', archetype: 'Architect (INTJ)', quote: 'El orden es la base.' },
    { id: 'deco', role: 'Project Manager', icon: 'star', color: '#2E9A98', archetype: 'Projector 2/4', quote: 'Ver mejor, no hacer más.' },
    { id: 'icaro', role: 'Marketing', icon: 'trending-up', color: '#FF5722', archetype: 'Magician (ENTP)', quote: 'Las palabras crean realidad.' },
    { id: 'atenea', role: 'Design', icon: 'palette', color: '#8b5cf6', archetype: 'Artist (ISFP)', quote: 'Belleza es verdad.' }
];

export default function GenesisWizard({ onClose, onProjectCreated }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        intent: '',
        category: 'branding',
        name: '',
        slogan: '',
        color: '#f59e0b',
        selectedAgents: ['nexus', 'deco'],
        justification: ''
    });

    const handleAgentToggle = (agentId) => {
        setFormData(prev => ({
            ...prev,
            selectedAgents: prev.selectedAgents.includes(agentId)
                ? prev.selectedAgents.filter(id => id !== agentId)
                : [...prev.selectedAgents, agentId]
        }));
    };

    const runNeuralAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/nexus/propose-project`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intent: formData.intent, category: formData.category })
            });
            const proposal = await response.json();

            if (proposal.error) throw new Error(proposal.error);

            setFormData(prev => ({
                ...prev,
                name: proposal.name || '',
                slogan: proposal.slogan || '',
                color: proposal.recommendedColor || '#f59e0b',
                justification: proposal.justification || 'Análisis neural completado.',
                suggestedMissions: Array.isArray(proposal.missions) ? proposal.missions : []
            }));
            setStep(2);
        } catch (error) {
            console.error("Neural Analysis Failed:", error);

            // Show specific error messages via react-hot-toast
            const errorMsg = error.message || '';
            const errorStatus = error.status || (error.message?.includes('429') ? 429 : error.message?.includes('500') ? 500 : 0);

            if (errorStatus === 429 || errorMsg.includes('429') || errorMsg.includes('Quota')) {
                toast.error(
                    'Límite de cuota excedido. La API está saturada. Espera 60 segundos e intenta nuevamente.',
                    {
                        duration: 8000,
                        icon: '⚠️',
                        style: {
                            background: '#1e293b',
                            color: '#fbbf24',
                            border: '1px solid #f59e0b'
                        }
                    }
                );
            } else if (errorStatus === 500 || errorMsg.includes('500')) {
                toast.error(
                    'Error en el servidor. Nexus está experimentando problemas. Intenta nuevamente.',
                    {
                        duration: 6000,
                        icon: '🔴',
                        style: {
                            background: '#1e293b',
                            color: '#ef4444',
                            border: '1px solid #dc2626'
                        }
                    }
                );
            } else {
                toast.error(
                    'Fallo en la sincronización neural. Verifica tu conexión.',
                    {
                        duration: 5000,
                        icon: '⚡',
                        style: {
                            background: '#1e293b',
                            color: '#06b6d4',
                            border: '1px solid #0891b2'
                        }
                    }
                );
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLaunch = async () => {
        setLoading(true);
        const projectId = formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7);

        try {
            // 1. Create Project Node
            // Sanitize payload to remove undefined values
            const projectPayload = {
                id: projectId,
                name: formData.name || 'Proyecto Sin Nombre',
                slogan: formData.slogan || '',
                status: 'active',
                createdAt: serverTimestamp(),
                theme: formData.color || '#f59e0b',
                description: formData.justification || '',
                tokenBurn: 0
            };
            await setDoc(doc(db, "projects", projectId), projectPayload);

            // 2. Inject Agents
            for (const agentId of formData.selectedAgents) {
                const template = ARCHETYPES.find(a => a.id === agentId);
                const agentData = {
                    ...template,
                    status: 'active',
                    current_task: 'Sincronizando con Cortex...',
                    directive: 'Operación Inicial',
                    stats: { energy: 100, sync: 100 }
                };
                await setDoc(doc(collection(db, "projects", projectId, "agents"), agentId), agentData);
            }

            // 3. Inject Suggested Missions
            if (formData.suggestedMissions) {
                for (let i = 0; i < formData.suggestedMissions.length; i++) {
                    await setDoc(doc(collection(db, "projects", projectId, "missions"), `mission_${i}`), {
                        title: formData.suggestedMissions[i],
                        status: 'pending',
                        agent: 'nexus',
                        priority: 'high',
                        createdAt: serverTimestamp()
                    });
                }
            }

            // Success Animation wait
            setTimeout(() => {
                onProjectCreated(projectId);
                onClose();
            }, 1000);

        } catch (error) {
            console.error("Genesis Error:", error);
            setLoading(false);
            alert("Error en la secuencia de inyección.");
        }
    };

    // --- Render Steps ---

    const renderStep1_Intent = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Protocolo 11: Génesis Inteligente</h2>
                <p className="text-gray-400 text-sm italic">"Describe tu visión, Nexus se encargará de la vibración."</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">¿Qué quieres manifestar?</label>
                    <textarea
                        autoFocus
                        value={formData.intent}
                        onChange={e => setFormData({ ...formData, intent: e.target.value })}
                        placeholder="Ej: Una escuela de decoración de tortas que empodere a mujeres emprendedoras..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-white text-lg focus:border-nexus-cyan focus:outline-none transition-all h-32 resize-none"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-mono uppercase tracking-wider text-gray-400">Categoría del Proyecto</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'branding', label: 'BRANDING', icon: '🎨', desc: 'Identidad visual' },
                            { id: 'ecommerce', label: 'E-COMMERCE', icon: '🛍️', desc: 'Tienda online' },
                            { id: 'app', label: 'APP/SaaS', icon: '📱', desc: 'Aplicación digital' },
                            { id: 'community', label: 'COMMUNITY', icon: '🌐', desc: 'Red social/foro' },
                            { id: 'education', label: 'EDUCACIÓN', icon: '📚', desc: 'Cursos/Academia' },
                            { id: 'content', label: 'CONTENIDO', icon: '✍️', desc: 'Blog/Media' },
                            { id: 'services', label: 'SERVICIOS', icon: '💼', desc: 'Consultoría/Pro' },
                            { id: 'portfolio', label: 'PORTFOLIO', icon: '🎭', desc: 'Showcase personal' }
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${formData.category === cat.id
                                    ? 'border-nexus-cyan bg-nexus-cyan/10 shadow-lg shadow-nexus-cyan/20'
                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{cat.icon}</span>
                                    <div>
                                        <div className="font-semibold text-white text-sm">{cat.label}</div>
                                        <div className="text-xs text-gray-500">{cat.desc}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                disabled={!formData.intent || isAnalyzing}
                onClick={runNeuralAnalysis}
                className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-nexus-cyan hover:text-white transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-30"
            >
                {isAnalyzing ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Analizando...</span> : <>Sincronizar Protocolo <ArrowRight className="w-4 h-4" /></>}
            </button>
        </motion.div>
    );

    const renderStep2_Proposal = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="p-6 bg-nexus-cyan/5 border border-nexus-cyan/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Hexagon size={80} /></div>
                <label className="text-[10px] font-mono text-nexus-cyan uppercase tracking-widest block mb-2">Propuesta Vibracional</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="bg-transparent border-none text-3xl font-bold text-white outline-none w-full"
                />
                <textarea
                    value={formData.slogan}
                    onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                    className="w-full h-32 bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-nexus-cyan focus:ring-2 focus:ring-nexus-cyan/20 transition-all resize-none"
                    placeholder="Ejemplo: 'Un ecommerce de productos artesanales sustentables para millennials conscientes' o 'Una app de productividad que gamifica las tareas diarias'..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-3">Justificación Neural</label>
                    <p className="text-xs text-gray-400 leading-relaxed">{formData.justification}</p>
                </div>
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-3">Color de Frecuencia</label>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: formData.color }} />
                        <span className="font-mono text-xs text-gray-300">{formData.color}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl font-bold uppercase text-xs tracking-widest">Re-analizar</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-3 bg-nexus-cyan text-white rounded-xl font-bold uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)]">Aceptar Identidad</button>
            </div>
        </motion.div>
    );

    const renderStep3_Team = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-4">Confirmar Equipo de Trabajo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARCHETYPES.map(agent => (
                    <div
                        key={agent.id}
                        onClick={() => handleAgentToggle(agent.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4
                            ${formData.selectedAgents.includes(agent.id)
                                ? 'bg-nexus-cyan/10 border-nexus-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                : 'bg-black/20 border-white/5 hover:bg-black/40'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${formData.selectedAgents.includes(agent.id) ? 'border-nexus-cyan text-nexus-cyan' : 'border-gray-600 text-gray-600'}`}>
                            {agent.id === 'nexus' && <Hexagon size={20} />}
                            {agent.id === 'deco' && <Star size={20} />}
                            {agent.id === 'icaro' && <Activity size={20} />}
                            {agent.id === 'atenea' && <Palette size={20} />}
                        </div>
                        <div>
                            <h4 className={`font-bold uppercase text-sm ${formData.selectedAgents.includes(agent.id) ? 'text-white' : 'text-gray-500'}`}>{agent.id}</h4>
                            <p className="text-[10px] text-gray-500">{agent.role}</p>
                        </div>
                        {formData.selectedAgents.includes(agent.id) && <Check className="ml-auto w-4 h-4 text-nexus-cyan" />}
                    </div>
                ))}
            </div>

            <button
                onClick={handleLaunch}
                className="w-full py-4 bg-nexus-orange text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-orange-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(249,115,22,0.2)] disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Inyectando ADN...' : <>MANIFESTAR PROYECTO <Rocket size={18} /></>}
            </button>
        </motion.div>
    );

    return createPortal(
        <>
            <motion.div
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                <div className="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative font-outfit">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between px-10 py-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500">Genesis Protocol v11.0</span>
                            </div>
                            {!loading && (
                                <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        <div className="p-10">
                            <AnimatePresence mode="wait">
                                {step === 1 && renderStep1_Intent()}
                                {step === 2 && renderStep2_Proposal()}
                                {step === 3 && renderStep3_Team()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Toaster position="top-right" />
        </>,
        document.body
    );
}
