import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Layers, CheckCircle2, Circle, ArrowRight, Zap } from 'lucide-react';

export default function MissionModal({ mission, onClose }) {
    if (!mission) return null;

    const steps = [
        { status: 'completed', title: 'Incepción Estratégica' },
        { status: 'in_progress', title: 'Ejecución Táctica' },
        { status: 'pending', title: 'Verificación de Calidad' },
        { status: 'pending', title: 'Despliegue Final' }
    ];

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { scale: 0.95, opacity: 0, x: 20 },
        visible: {
            scale: 1,
            opacity: 1,
            x: 0,
            transition: { type: "tween", duration: 0.3 }
        }
    };

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-3xl bg-[#0F172A] border border-nexus-amber/20 rounded-xl overflow-hidden shadow-2xl relative font-outfit"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tech Background Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* Header */}
                <div className="relative p-8 border-b border-white/10 flex justify-between items-start bg-black/40">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-nexus-amber/10 rounded-lg">
                                <Layers className="w-6 h-6 text-nexus-amber" />
                            </div>
                            <span className="text-nexus-amber font-mono text-xs uppercase tracking-[0.2em]">Blueprint Táctico</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-wide">{mission.title || "Misión Desconocida"}</h2>
                        <p className="text-gray-400 text-sm mt-1 font-light">Asignado a: <span className="text-white font-bold uppercase">{mission.agent || "N/A"}</span></p>
                    </div>

                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content (The Plan) */}
                <div className="relative p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left: Status & Priority */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Prioridad</h3>
                            <div className={`text-lg font-bold uppercase ${mission.priority === 'high' ? 'text-red-500' : 'text-nexus-amber'}`}>
                                {mission.priority === 'high' ? 'CRÍTICA' : 'ESTÁNDAR'}
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                            <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Estado</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-lg font-bold uppercase text-white">{(mission.status || "pending").replace(/_/g, ' ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Timeline */}
                    <div className="md:col-span-2">
                        <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-2 flex justify-between">
                            <span>Secuencia de Ejecución</span>
                            <span className="font-mono text-nexus-amber">v1.2</span>
                        </h3>

                        <div className="space-y-6 relative">
                            {/* Connecting Line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/10" />

                            {steps.map((step, i) => (
                                <div key={i} className="relative flex items-center gap-4 group">
                                    <div className={`z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[#0F172A] transition-colors duration-300
                                 ${step.status === 'completed' ? 'border-green-500 text-green-500' :
                                            step.status === 'in_progress' ? 'border-nexus-amber text-nexus-amber shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                                                'border-gray-700 text-gray-700'}`}
                                    >
                                        {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-2 h-2" fill="currentColor" />}
                                    </div>

                                    <div className={`flex-1 p-3 rounded-lg border transition-all duration-300
                                 ${step.status === 'in_progress' ? 'bg-nexus-amber/5 border-nexus-amber/30 translate-x-1' : 'bg-transparent border-transparent'}`}
                                    >
                                        <h4 className={`text-sm font-bold ${step.status === 'pending' ? 'text-gray-600' : 'text-gray-200'}`}>{step.title}</h4>
                                    </div>

                                    {step.status === 'in_progress' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-nexus-amber"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="relative p-6 bg-black/20 border-t border-white/5 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-bold">
                        Cerrar
                    </button>
                    <button className="px-6 py-2 bg-nexus-amber text-black text-sm rounded md:hover:bg-amber-400 transition-colors uppercase tracking-wider font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Acelerar
                    </button>
                </div>

            </motion.div>
        </motion.div>,
        document.body
    );
}
