'use client';

import React, { useState } from 'react';
import { WidgetCard } from '@/components/showroom/WidgetCard';
import { LivePreview } from '@/components/showroom/LivePreview';
import { Layout, MonitorPlay, ShoppingCart, Database, Zap } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { MOCK_IMAGES, WIDGET_DATA, TIERS } from './constants';


export default function StitchLibrary() {
    const [activeTier, setActiveTier] = useState('all');
    const [search, setSearch] = useState('');
    const [previewWidget, setPreviewWidget] = useState<{id: string, label: string, data: any} | null>(null);

    // Dynamic Counts State
    const [counts, setCounts] = useState<{all: number, visual: number, conversion: number, systems: number}>({
        all: 0, visual: 0, conversion: 0, systems: 0
    });

    // Calculate Real Counts
    const realCounts = React.useMemo(() => {
        return {
            all: WIDGET_DATA.length,
            visual: WIDGET_DATA.filter(w => w.tier === 'visual').length,
            conversion: WIDGET_DATA.filter(w => w.tier === 'conversion').length,
            systems: WIDGET_DATA.filter(w => w.tier === 'systems').length,
        };
    }, []);

    // Odometer Animation Effect
    React.useEffect(() => {
        const duration = 1000; // 1s
        const steps = 30;
        const interval = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounts({
                all: Math.floor(realCounts.all * progress),
                visual: Math.floor(realCounts.visual * progress),
                conversion: Math.floor(realCounts.conversion * progress),
                systems: Math.floor(realCounts.systems * progress),
            });
            if (step >= steps) clearInterval(timer);
        }, interval);
        
        return () => clearInterval(timer);
    }, [realCounts]);

    const filteredWidgets = WIDGET_DATA.filter(w => {
        const matchesTier = activeTier === 'all' || w.tier === activeTier;
        const matchesSearch = w.label.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase());
        return matchesTier && matchesSearch;
    });

    const triggerPreview = (id: string) => {
        const widget = WIDGET_DATA.find(w => w.id === id);
        if (widget) {
            setPreviewWidget({
                id: widget.id,
                label: widget.label,
                data: widget.data || {}
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
            <Toaster position="bottom-right" />
            
            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-indigo-500/20">
                            <Zap className="text-white w-6 h-6" fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter">Arsenal Stitch <span className="text-indigo-400">Library</span></h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sovereign Asset Vault v2.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <input 
                            type="text" 
                            placeholder="BUSCAR EQUIPAMIENTO..." 
                            className="bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-3 text-xs font-bold focus:outline-none focus:border-indigo-500 w-64 uppercase tracking-widest"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
                    {TIERS.map(tier => (
                        <button
                            key={tier.id}
                            onClick={() => setActiveTier(tier.id)}
                            className={`flex items-center gap-2 px-8 py-4 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                                activeTier === tier.id 
                                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                                : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <tier.icon className="w-3 h-3" />
                            {tier.label} ({counts[tier.id as keyof typeof counts]})
                        </button>
                    ))}
                </div>
            </header>

            {/* --- GRID --- */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 gap-8">
                    {filteredWidgets.map(widget => (
                        <WidgetCard 
                            key={widget.id}
                            id={widget.id}
                            label={widget.label}
                            description={widget.description}
                            tier={widget.tier}
                            tags={widget.tags}
                            configProps={widget.configProps}
                            onPreview={triggerPreview}
                        />
                    ))}
                </div>

                {filteredWidgets.length === 0 && (
                    <div className="text-center py-20 text-slate-500 font-black text-xs uppercase tracking-widest bg-slate-800/20 rounded-3xl border border-dashed border-white/5">
                        <p>No se encontraron activos compatibles con tu nivel de acceso.</p>
                    </div>
                )}
            </main>

            {/* --- MODAL SYSTEM --- */}
            <LivePreview 
                isOpen={!!previewWidget}
                widgetId={previewWidget?.id || null}
                widgetLabel={previewWidget?.label || ''}
                widgetData={previewWidget?.data}
                onClose={() => setPreviewWidget(null)}
            />
        </div>
    );
}
