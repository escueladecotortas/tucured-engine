// Archivo: src/components/tabs/StitchShowroom.jsx
// Arsenal Stitch: Catálogo interactivo de componentes modulares UI

import React, { useState, useEffect } from 'react';
import { RefreshCw, LayoutGrid, Layers, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StitchShowroom() {
    const [components, setComponents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const fetchComponents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stitch/components');
            if (res.ok) {
                const data = await res.json();
                setComponents(data.components || []);
                if (data.components?.length > 0 && !selectedComponent) {
                    setSelectedComponent(data.components[0]);
                }
            }
        } catch (e) {
            console.error("Error cargando componentes Stitch:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    const handleCopyCode = async () => {
        if (!selectedComponent?.content) return;
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(selectedComponent.content);
            setCopied(true);
            toast.success(`¡Código de "${selectedComponent.name}" copiado!`);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const categories = ['all', 'heroes', 'grids', 'galleries', 'booking', 'social', 'footers', 'powerups'];
    const filtered = selectedCategory === 'all' 
        ? components 
        : components.filter(c => c.category === selectedCategory);

    return (
        <div className="flex flex-col h-full bg-[#0F172A] relative overflow-hidden rounded-xl border border-white/10 shadow-2xl font-mono">
            {/* Header */}
            <div className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-amber-400">ARSENAL STITCH v4.0</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        {components.length} Componentes Modulares Registrados
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchComponents}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Recargar Catálogo"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6 min-h-0">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 shrink-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                                selectedCategory === cat 
                                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid + Inspector Panel */}
                <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">
                    {/* Component List */}
                    <div className="col-span-12 lg:col-span-5 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {filtered.map(comp => (
                            <div
                                key={comp.id}
                                onClick={() => setSelectedComponent(comp)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                    selectedComponent?.id === comp.id
                                        ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{comp.category}</span>
                                    <span className="text-[10px] text-slate-500">{(comp.sizeBytes / 1024).toFixed(1)} KB</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">{comp.name}</h4>
                                <p className="text-xs text-slate-400 truncate">{comp.fileName}</p>
                            </div>
                        ))}
                    </div>

                    {/* Inspector / Code Preview */}
                    <div className="col-span-12 lg:col-span-7 bg-black/50 border border-white/10 rounded-xl p-5 flex flex-col overflow-hidden">
                        {selectedComponent ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
                                    <div>
                                        <h3 className="text-base font-bold text-white">{selectedComponent.name}</h3>
                                        <span className="text-xs text-amber-400/80">{selectedComponent.category.toUpperCase()} / {selectedComponent.fileName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCopyCode}
                                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                            title="Copiar Código HTML"
                                        >
                                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
                                        </button>
                                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">READY_FOR_INJECTION</span>
                                    </div>
                                </div>

                                <div className="flex-1 bg-slate-950 border border-white/5 rounded-lg p-4 text-xs text-slate-300 overflow-y-auto custom-scrollbar">
                                    <pre className="whitespace-pre-wrap">{selectedComponent.content}</pre>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                                Selecciona un componente para inspeccionar su estructura atómica
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
