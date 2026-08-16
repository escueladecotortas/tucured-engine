// Archivo: frontend/src/components/tabs/shield/SnapshotCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RotateCcw } from 'lucide-react';

export function SnapshotCard({ snapshot, index, totalCount, restoring, onRestore }) {
    const manifest = snapshot.manifest;
    const datePart = snapshot.id.substring(0, 10);
    const timePart = snapshot.id.substring(11).replace(/-/g, ':');

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-nexus-cyan/40 transition-all group flex flex-col gap-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/40 border border-white/10 min-w-[80px]">
                        <span className="text-[10px] uppercase tracking-tighter text-nexus-cyan/60 mb-1">Versión</span>
                        <span className="text-xl font-bold text-nexus-cyan font-outfit">v{totalCount - index}</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-nexus-white font-outfit tracking-tight group-hover:text-nexus-cyan transition-colors">
                            {manifest?.title || (snapshot.reason === 'manual' ? 'Snapshot Manual' : `Acción: ${snapshot.reason}`)}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                                <Clock className="w-3 h-3 text-white/40" />
                                <span className="text-xs font-medium text-white/70 font-outfit">{timePart}</span>
                            </div>
                            <span className="text-[10px] text-white/30 font-mono tracking-widest">{datePart}</span>
                            <span className="px-2 py-0.5 rounded-full bg-nexus-cyan/10 text-nexus-cyan text-[8px] font-bold border border-nexus-cyan/20 tracking-widest uppercase">
                                Full Snapshot
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onRestore(snapshot.versionId)}
                        disabled={restoring === snapshot.versionId}
                        className="px-6 py-2.5 rounded-xl bg-black/40 border border-nexus-cyan/30 text-nexus-cyan text-xs font-bold hover:bg-nexus-cyan hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 clickable-scale"
                    >
                        {restoring === snapshot.versionId ? (
                            <RotateCcw className="w-3 h-3 animate-spin" />
                        ) : (
                            <RotateCcw className="w-3 h-3" />
                        )}
                        Restaurar
                    </button>
                </div>
            </div>

            {/* Details Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 mt-1">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/30">Tamaño del Proyecto</span>
                    <span className="text-sm font-medium text-white/80">{manifest?.stats?.sizeMB || '--'} MB</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/30">Total Archivos</span>
                    <span className="text-sm font-medium text-white/80">{manifest?.stats?.files || '--'} archivos</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/30">ID de Versión</span>
                    <span className="text-[10px] font-mono text-white/40 break-all">{snapshot.id}</span>
                </div>
            </div>

            {manifest?.description && (
                <div className="bg-black/20 rounded-lg p-3 border border-white/5 italic">
                    <p className="text-[11px] text-white/50 leading-relaxed">
                        “{manifest.description}”
                    </p>
                </div>
            )}
        </motion.div>
    );
}
