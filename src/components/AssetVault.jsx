// Archivo: frontend/src/components/AssetVault.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, MapPin, Star, MessageSquare, Download, FileText } from 'lucide-react';
import FileManager from './FileManager';

export default function AssetVault({ projectId, assetsPath }) {
    const [assets, setAssets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Normalizar: si projectId viene como path completo (ej: "tucu-red/clients/pacara"),
    // extraer solo el segmento final (slug del cliente)
    const clientSlug = projectId ? projectId.split('/').filter(Boolean).pop() : null;

    useEffect(() => {
        if (!assetsPath || !clientSlug) return;

        setLoading(true);

        // Fetch client-assets.json directamente desde los archivos estáticos
        const jsonUrl = `/nexus_archives/tucu-red/clients/${clientSlug}/client-assets.json`;
        console.log('[AssetVault] Cargando:', jsonUrl);

        fetch(jsonUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setAssets(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('[AssetVault]', err);
                setError(`No se encontró el archivo de activos (${err.message}). Ejecutá una extracción primero.`);
                setLoading(false);
            });

    }, [clientSlug, assetsPath]);

    if (!assetsPath) return (
        <div className="p-10 text-center text-gray-500">No Asset Library defined for this client.</div>
    );
    if (loading) return (
        <div className="p-10 text-center text-indigo-400 animate-pulse font-mono">ACCESSING ELARA'S VAULT...</div>
    );
    if (error) return (
        <div className="p-10 text-center text-rose-400 font-mono text-sm max-w-md mx-auto">{error}</div>
    );

    // Fallback de logo usando iniciales si la imagen falla
    const logoFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(assets.business_name)}&background=6366f1&color=fff&size=128`;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8">

            {/* Identity Header */}
            <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl bg-black flex-shrink-0">
                    <img
                        src={assets.logo_url || logoFallback}
                        alt="Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = logoFallback; }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-white mb-2 truncate">{assets.business_name}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {assets.source}</span>
                        <span className="flex items-center gap-1 text-emerald-400"><Star className="w-3 h-3 fill-current" /> VALIDATED DATA</span>
                        {assets.phone && <span className="text-gray-500">{assets.phone}</span>}
                    </div>
                </div>
                <button
                    onClick={() => window.open(`/api/nexus/zip-assets?projectId=${clientSlug}`, '_blank')}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-300 rounded-lg hover:bg-indigo-600/30 transition-colors text-xs font-bold uppercase tracking-wider">
                    <Download className="w-4 h-4" /> Export Brand Kit
                </button>
            </div>

            {/* Photo Gallery Grid */}
            {assets.photos && assets.photos.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Image className="w-4 h-4 text-indigo-400" /> Galería de Activos ({assets.photos.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {assets.photos.map((url, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-indigo-500/50 transition-all group"
                                onClick={() => window.open(url, '_blank')}
                            >
                                <img
                                    src={url}
                                    alt={`Asset ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* File Manager Integration */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" /> Explorador de Archivos
                </h3>
                <div className="h-[400px] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <FileManager projectId={clientSlug} rootPath="assets" />
                </div>
            </div>

            {/* Reviews Section */}
            {assets.reviews && assets.reviews.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-400" /> Customer Voice ({assets.reviews.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {assets.reviews.map((review, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-white">{review.author}</span>
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed italic">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
