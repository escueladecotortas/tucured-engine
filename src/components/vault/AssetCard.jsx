// Archivo: src/components/vault/AssetCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Globe, FileText } from 'lucide-react';

export function AssetCard({ item, idx, subfolder, onClick }) {
    const isImage = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes((item.name || '').split('.').pop().toLowerCase());
    const isHtml = (item.name || '').endsWith('.html');
    const isFolder = item.type === 'folder';
    const rawPath = subfolder ? `public/clients/adore-tu-esencia/${subfolder}/${item.name}` : `public/clients/adore-tu-esencia/${item.name}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            onClick={onClick}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/40 rounded-xl flex flex-col justify-between transition-all group cursor-pointer"
        >
            <div className="aspect-square bg-black/40 rounded-lg overflow-hidden flex items-center justify-center mb-2 relative">
                {isImage ? (
                    <img 
                        src={`/api/files/raw?path=${encodeURIComponent(rawPath)}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : isFolder ? (
                    <Folder className="w-8 h-8 text-pink-400 fill-current opacity-80 group-hover:scale-110 transition-transform" />
                ) : isHtml ? (
                    <Globe className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                ) : (
                    <FileText className="w-8 h-8 text-emerald-400" />
                )}
            </div>

            <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-pink-300 transition-colors" title={item.name}>
                    {item.name}
                </h4>
                <div className="text-[10px] text-gray-500 mt-0.5">
                    {isFolder ? 'Carpeta' : `${Math.round((item.size || 0) / 1024)} KB`}
                </div>
            </div>
        </motion.div>
    );
}
