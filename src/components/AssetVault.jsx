// Archivo: src/components/AssetVault.jsx
// Galería de Activos de Marca con Navegación Interna y Preview Soberano

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Folder, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import { AssetCard } from './vault/AssetCard';
import { AssetPreviewModal } from './vault/AssetPreviewModal';

export default function AssetVault({ projectId = 'tucu-red' }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subfolder, setSubfolder] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [previewItem, setPreviewItem] = useState(null);

    const fetchAssets = async (sub = '') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/nexus/assets/list?projectId=${projectId}&subfolder=${encodeURIComponent(sub)}`);
            const data = await res.json();
            if (Array.isArray(data)) setAssets(data);
        } catch (e) {
            console.error('[AssetVault]', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets(subfolder);
    }, [projectId, subfolder]);

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'images', label: 'Imágenes' },
        { id: 'web', label: 'Demos & HTML' },
        { id: 'docs', label: 'Docs' }
    ];

    const filteredAssets = assets.filter(item => {
        if (selectedCategory === 'all') return true;
        const ext = (item.name || '').split('.').pop().toLowerCase();
        if (selectedCategory === 'images') return ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext);
        if (selectedCategory === 'web') return ['html', 'css', 'js'].includes(ext) || item.type === 'folder';
        if (selectedCategory === 'docs') return ['md', 'json', 'txt'].includes(ext);
        return true;
    });

    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            setSubfolder(subfolder ? `${subfolder}/${item.name}` : item.name);
        } else {
            setPreviewItem(item);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-hidden font-mono bg-[#050510]">
            {/* Header & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-pink-400" /> Activos de Marca y Demos
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <span className="hover:text-white cursor-pointer" onClick={() => setSubfolder('')}>activos</span>
                        {subfolder && subfolder.split('/').map((part, i, arr) => (
                            <React.Fragment key={i}>
                                <ChevronRight className="w-3 h-3 text-gray-600" />
                                <span 
                                    className="text-pink-400 hover:underline cursor-pointer" 
                                    onClick={() => setSubfolder(arr.slice(0, i + 1).join('/'))}
                                >
                                    {part}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => fetchAssets(subfolder)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Recargar"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                                    selectedCategory === cat.id ? 'bg-pink-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-pink-400 animate-pulse text-xs">
                        Indexando galería...
                    </div>
                ) : filteredAssets.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                        <Folder className="w-10 h-10 mb-2 opacity-40 text-pink-400" />
                        <p className="text-xs">No hay elementos en esta carpeta</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                        {filteredAssets.map((item, idx) => (
                            <AssetCard 
                                key={item.name + idx} 
                                item={item} 
                                idx={idx} 
                                subfolder={subfolder}
                                onClick={() => handleItemClick(item)} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Preview Interno */}
            <AnimatePresence>
                {previewItem && (
                    <AssetPreviewModal 
                        item={previewItem} 
                        subfolder={subfolder} 
                        onClose={() => setPreviewItem(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
