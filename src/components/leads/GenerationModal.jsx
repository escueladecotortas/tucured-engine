// Archivo: frontend/src/components/leads/GenerationModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AgentPanel from "./AgentPanel";
import { EngineSelector } from "./modal/EngineSelector";
import { MatrixConsole } from "./modal/MatrixConsole";
import { GenerationResult } from "./modal/GenerationResult";

const SUCCESS_RE = /Sitio\s?(re)?generado|Payload ensamblado|Pipeline complet[a-z]*|Completado|https:\/\/.*\.tucured\.ar|✅/i;
const ERROR_RE = /Error|Falló|❌/i;

export default function GenerationModal({ isOpen, prospect, logs = [], onClose, onStartGeneration }) {
    const [engine, setEngine] = useState(null);
    const [progress, setProgress] = useState(0);

    const isFinished = logs.some((l) => {
        const text = l.line || l.message;
        return text && (SUCCESS_RE.test(text) || ERROR_RE.test(text));
    });
    const isSuccess = logs.some((l) => {
        const text = l.line || l.message;
        return text && SUCCESS_RE.test(text);
    });
    const isRunning = !!engine && !isFinished;

    useEffect(() => { if (isOpen) { setEngine(null); setProgress(0); } }, [isOpen, prospect]);

    useEffect(() => {
        if (!isRunning) return;
        const tick = setInterval(() => setProgress((p) => p >= 92 ? p : p + Math.max(0.3, (92 - p) / 25)), 300);
        return () => clearInterval(tick);
    }, [isRunning]);

    useEffect(() => { if (isFinished) setProgress(100); }, [isFinished]);

    const handleSelect = (selectedEngine) => {
        setEngine(selectedEngine);
        onStartGeneration?.(selectedEngine);
    };

    const buildFinalUrl = () => {
        const slug = prospect?.slug || prospect?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return { href: `https://${slug}.tucured.ar`, label: `${slug}.tucured.ar` };
    };

    if (!isOpen || !prospect) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0A0A0F] border border-purple-500/20 rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                <ModalHeader isFinished={isFinished} engine={engine} onClose={onClose} />
                <ProgressBar progress={progress} isFinished={isFinished} isSuccess={isSuccess} engine={engine} />

                <AnimatePresence mode="wait">
                    {!engine ? (
                        <motion.div key="sel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <EngineSelector prospect={prospect} onSelect={handleSelect} />
                        </motion.div>
                    ) : isFinished ? (
                        <GenerationResult isSuccess={isSuccess} finalUrl={buildFinalUrl()} logs={logs} onClose={onClose} />
                    ) : (
                        <motion.div key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <AgentPanel logs={logs} isRunning={isRunning} isFinished={isFinished} />
                            <div className="mt-6"><MatrixConsole logs={logs} /></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function ModalHeader({ isFinished, engine, onClose }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-lg shadow-purple-500/20">⚛</div>
                <div>
                    <div className="font-black text-white text-sm uppercase tracking-widest">Neural Factory</div>
                    <div className="text-[9px] text-purple-400 font-mono tracking-tighter uppercase">NEXUS OS Pipeline</div>
                </div>
            </div>
            {(isFinished || !engine) && (
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 transition-colors">✕</button>
            )}
        </div>
    );
}

function ProgressBar({ progress, isFinished, isSuccess, engine }) {
    if (!engine) return null;
    return (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    {isFinished ? (isSuccess ? "✅ ÉXITO" : "❌ ERROR") : "PROCESANDO PIPELINE"}
                </span>
                <span className="text-[10px] font-mono text-purple-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} className={`h-full rounded-full ${isFinished ? (isSuccess ? 'bg-emerald-500' : 'bg-red-500') : 'bg-gradient-to-r from-purple-500 to-blue-500'}`} />
            </div>
        </div>
    );
}
