// Archivo: frontend/src/components/tabs/ShieldTab.jsx
'use client';
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Shield, Search, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../core';
import { useShieldData } from '../../hooks/useShieldData';
import { ShieldStats } from './shield/ShieldStats';
import { SnapshotCard } from './shield/SnapshotCard';

export default function ShieldTab({ projectId }) {
    const { 
        snapshots, 
        loading, 
        restoring, 
        backingUp, 
        handleBackup, 
        handleRestore 
    } = useShieldData(projectId);
    
    const [searchTerm, setSearchTerm] = useState('');

    const onBackup = async () => {
        const result = await handleBackup();
        if (!result.success) alert("Backup failed: " + result.error);
    };

    const onRestore = async (versionId) => {
        if (!confirm(`¿Estás seguro de restaurar la versión ${versionId}? Los cambios actuales se perderán (se creará un backup automático antes).`)) return;
        const result = await handleRestore(versionId);
        if (result.success) {
            alert("Proyecto restaurado exitosamente.");
            window.location.reload();
        } else {
            alert("Error al restaurar: " + result.error);
        }
    };

    const filteredSnapshots = snapshots.filter(s => 
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full space-y-6 p-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />

            <ShieldStats 
                snapshotsCount={snapshots.length} 
                backingUp={backingUp} 
                onBackup={onBackup} 
            />

            <GlassCard className="flex-1 flex flex-col overflow-hidden border-nexus-purple/20">
                <div className="p-4 border-b border-nexus-purple/10 flex items-center justify-between bg-nexus-purple/5">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-nexus-purple animate-pulse" />
                        <h3 className="text-sm font-bold text-nexus-white tracking-widest uppercase text-neon">Bóveda de Versiones</h3>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-nexus-purple/40" />
                        <input 
                            type="text" 
                            placeholder="Buscar versión..." 
                            className="bg-black/40 border border-nexus-purple/20 rounded-full py-1 pl-8 pr-4 text-[10px] text-nexus-white focus:outline-none focus:border-nexus-purple w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-xs text-nexus-purple/40 animate-pulse">
                            Escaneando Bóveda de Seguridad...
                        </div>
                    ) : filteredSnapshots.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-nexus-purple/40">
                            No se encontraron snapshots para este proyecto.
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredSnapshots.map((snapshot, idx) => (
                                <SnapshotCard 
                                    key={snapshot.id}
                                    snapshot={snapshot}
                                    index={idx}
                                    totalCount={snapshots.length}
                                    restoring={restoring}
                                    onRestore={onRestore}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                <div className="p-4 bg-red-500/5 border-t border-red-500/10 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Protocolo de Seguridad</p>
                        <p className="text-[9px] text-red-400/60 leading-relaxed max-w-xl">
                            Las versiones anteriores son snapshots completos del sistema de archivos. La restauración sobrescribirá el estado actual. NEXUS crea automáticamente un backup del estado actual antes de proceder.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
