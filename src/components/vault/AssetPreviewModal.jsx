// Archivo: src/components/vault/AssetPreviewModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

export function AssetPreviewModal({ item, subfolder, onClose }) {
    if (!item) return null;
    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes((item.name || '').split('.').pop().toLowerCase());
    const isHtml = (item.name || '').endsWith('.html');
    const rawPath = subfolder ? `public/clients/adore-tu-esencia/${subfolder}/${item.name}` : `public/clients/adore-tu-esencia/${item.name}`;
    const directUrl = `/clients/adore-tu-esencia/${item.name}`;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono"
            >
                <div className="h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/10">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-black/40">
                    {isImage ? (
                        <img src={`/api/files/raw?path=${encodeURIComponent(rawPath)}`} alt={item.name} className="max-h-[60vh] object-contain rounded-lg" />
                    ) : isHtml ? (
                        <iframe src={directUrl} title={item.name} className="w-full h-96 rounded-lg border border-white/10 bg-white" />
                    ) : (
                        <div className="text-xs text-gray-300 p-4">Previsualización binaria no disponible.</div>
                    )}
                </div>

                <div className="p-3 bg-white/5 border-t border-white/10 flex justify-end gap-2">
                    {isHtml && (
                        <a href={directUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                            <ExternalLink className="w-3.5 h-3.5" /> Abrir Demo en Pestaña
                        </a>
                    )}
                    <button onClick={onClose} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-xs font-bold cursor-pointer">
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
