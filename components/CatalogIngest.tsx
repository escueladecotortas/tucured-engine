'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2, Sparkles, ScanLine, Tag, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CatalogIngestProps {
    onItemsExtracted?: (items: any[]) => void;
}

export default function CatalogIngest({ onItemsExtracted }: CatalogIngestProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
    const [items, setItems] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setStatus('idle');
            setItems([]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setStatus('analyzing');
        const formData = new FormData();
        formData.append('catalog', file);

        try {
            const res = await fetch('/api/vision/ingest', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setItems(data.items);
                setStatus('success');
                if (onItemsExtracted) onItemsExtracted(data.items);
            } else {
                console.error(data.error);
                setStatus('error');
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <div className="w-full">

            {/* Upload Zone */}
            <div className={`
                relative overflow-hidden rounded-2xl transition-all duration-500 group
                ${file ? 'border-amber-500/50 bg-black/60' : 'border-2 border-dashed border-white/10 hover:border-amber-500/30 hover:bg-white/5'}
            `}>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    id="catalog-upload"
                />

                <div className="p-12 flex flex-col items-center justify-center min-h-[300px] text-center relative z-10">
                    <AnimatePresence mode='wait'>
                        {preview ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative max-w-md w-full"
                            >
                                <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg shadow-2xl shadow-black/50" />
                                <div className="absolute inset-0 rounded-lg ring-1 ring-white/10 pointer-events-none" />

                                {status === 'analyzing' && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
                                        <ScanLine className="w-12 h-12 text-amber-500 animate-pulse mb-4" />
                                        <span className="text-amber-200 font-mono text-sm tracking-widest animate-pulse">ESCANEANDO PATRONES...</span>
                                    </div>
                                )}

                                <div className="mt-4 flex justify-between items-center text-xs text-white/40 uppercase tracking-wider font-bold">
                                    <span>{file?.name}</span>
                                    <button onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null); }} className="hover:text-amber-500 z-50 relative pointer-events-auto">Cambiar</button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10 group-hover:border-amber-500/30 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                                    <Upload className="w-8 h-8 text-white/40 group-hover:text-amber-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-amber-100 transition-colors">Sube tu Archivo Aquí</h3>
                                <p className="text-white/40 max-w-xs text-sm">Soporta JPG, PNG o PDF. La IA detectará automáticamente productos y precios.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Actions */}
            <AnimatePresence>
                {file && status !== 'success' && status !== 'analyzing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex justify-end"
                    >
                        <button
                            onClick={handleAnalyze}
                            className="relative group px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all flex items-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 fill-black/20" />
                                Iniciar Magia
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-12"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl text-emerald-400 flex items-center gap-2 font-bold">
                                <CheckCircle className="w-6 h-6" />
                                {items.length} Productos Desbloqueados
                            </h4>
                            <span className="text-white/20 text-sm font-mono">CONFIDENCE_SCORE: 98%</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group cursor-default"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-500/70 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5">
                                            {item.category || 'VARIOS'}
                                        </span>
                                    </div>
                                    <h5 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-amber-100 transition-colors">
                                        {item.name}
                                    </h5>

                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-white/30 text-xs flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> SKU-{1000 + idx}
                                        </span>
                                        <span className="text-xl font-mono text-emerald-400 font-bold flex items-center">
                                            <DollarSign className="w-4 h-4" />
                                            {item.price?.toLocaleString() || '-'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
