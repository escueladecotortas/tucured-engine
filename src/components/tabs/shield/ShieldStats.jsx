// Archivo: frontend/src/components/tabs/shield/ShieldStats.jsx
import React from 'react';
import { Shield, Database, RotateCcw, Plus } from 'lucide-react';
import { GlassCard } from '../../core';

export function ShieldStats({ snapshotsCount, backingUp, onBackup }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 border-nexus-cyan/20 bg-nexus-cyan/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-nexus-cyan/20">
                        <Shield className="w-5 h-5 text-nexus-cyan" />
                    </div>
                    <div>
                        <p className="text-[10px] text-nexus-cyan/60 uppercase tracking-widest">Estado del Escudo</p>
                        <p className="text-xl font-bold text-nexus-white">ACTIVO</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-4 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                        <Database className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-amber-400/60 uppercase tracking-widest">Backups Disponibles</p>
                        <p className="text-xl font-bold text-nexus-white">{snapshotsCount} / 10</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard 
                className="p-4 border-indigo-500/20 bg-indigo-500/5 flex items-center justify-center cursor-pointer hover:bg-indigo-500/10 transition-all group" 
                onClick={onBackup}
            >
                {backingUp ? (
                    <div className="flex items-center gap-3">
                        <RotateCcw className="w-5 h-5 text-indigo-400 animate-spin" />
                        <span className="text-sm font-medium text-indigo-400">Creando Snapshot...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5 text-indigo-400 group-hover:scale-125 transition-transform" />
                        <span className="text-sm font-medium text-indigo-400">Snapshot Manual</span>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
