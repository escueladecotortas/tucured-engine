// Archivo: src/components/tabs/vault/DataCoreBackup.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Download, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export function DataCoreBackup({ isBackingUp, backupStatus, onBackup }) {
    return (
        <motion.div
            key="database"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex items-center justify-center p-8 font-mono"
        >
            <div className="w-full max-w-md bg-[#0A0A1A] border border-white/10 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all">
                        <Database className="w-8 h-8 text-emerald-400" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                        <span>Núcleo de Datos (SSOT)</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h3>
                    
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        Exportación soberana del estado del motor, catálogo de servicios y estadísticas locales.
                        <br />
                        <span className="text-emerald-400/90 font-bold">Respaldo atómico 100% Local-First.</span>
                    </p>

                    <div className="w-full space-y-3">
                        <button
                            onClick={onBackup}
                            disabled={isBackingUp}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isBackingUp ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>COMPILANDO SNAPSHOT...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>DESCARGAR SNAPSHOT (.JSON)</span>
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {backupStatus === 'success' && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-medium pt-2">
                                    <CheckCircle className="w-3.5 h-3.5" /> Snapshot generado y descargado con éxito.
                                </motion.div>
                            )}
                            {backupStatus === 'error' && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-rose-400 text-xs font-medium pt-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Error al compilar snapshot.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
