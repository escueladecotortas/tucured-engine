// Archivo: frontend/src/components/cyborg-ops/NeuralStream.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const NeuralStream = ({ logs }) => {
    return (
        <div className="lg:col-span-8 flex flex-col h-[600px] bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-zinc-900/80 border-b border-zinc-800 p-3 flex items-center justify-between backdrop-blur">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-400">/var/log/nexus_neural_stream.log</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs custom-scrollbar bg-black/50">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-2 flex gap-3 hover:bg-white/5 p-1 rounded -mx-1"
                        >
                            <span className="text-zinc-600 shrink-0 select-none">
                                {log.timestamp.toLocaleTimeString()}
                            </span>
                            <span className={`shrink-0 font-bold w-20 ${log.type === 'error' || log.type === 'failure' ? 'text-red-500' :
                                    log.type === 'success' || log.status === 'success' ? 'text-emerald-500' :
                                        log.type === 'warning' ? 'text-amber-500' :
                                            log.type === 'system_flush' ? 'text-pink-500' :
                                                'text-blue-500'
                                }`}>
                                {log.agent ? log.agent.toUpperCase() : 'SYSTEM'}
                            </span>
                            <span className="text-zinc-300 break-all">
                                {log.description || log.message || JSON.stringify(log)}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {logs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-zinc-700 italic">
                        Waiting for neural activity...
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex items-center gap-2">
                <span className="text-emerald-500">➜</span>
                <span className="text-zinc-500">_</span>
            </div>
        </div>
    );
};

export default NeuralStream;
