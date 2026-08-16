// Archivo: frontend/src/components/tabs/WidgetProductModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Package, Code, Terminal } from 'lucide-react';
import { WIDGET_REGISTRY } from '../widgets/library/registry';

const WidgetProductModal = ({ widget, onClose }) => {
    const [schema, setSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({});

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const filename = widget.id.endsWith('.jsx') ? widget.id : `${widget.id}.jsx`;
                const res = await fetch(`/api/files/read?project=widgets&path=${encodeURIComponent(filename)}`);
                if (res.ok) {
                    const data = await res.json();
                    const content = data.content;
                    const match = content.match(/\/\/ CONFIG_SCHEMA:\s*[\r\n]+((?:\s*\/\/.*[\r\n]*)+)/);
                    if (match) {
                        try {
                            const rawLines = match[1];
                            const jsonStr = rawLines.replace(/^\s*\/\/\s?/gm, '').trim();
                            const parsed = JSON.parse(jsonStr);
                            setSchema(parsed);
                            const defaults = {};
                            Object.keys(parsed).forEach(key => {
                                if (key === 'businessName') defaults[key] = 'Nexus Corp';
                                else if (key === 'hours') defaults[key] = '9:00 - 18:00';
                                else if (key === 'city') defaults[key] = 'Tucumán';
                                else if (key === 'temp') defaults[key] = 25;
                                else if (key === 'condition') defaults[key] = 'sunny';
                                else if (key === 'images') defaults[key] = ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'];
                                else defaults[key] = parsed[key]?.default || '';
                            });
                            setConfig(defaults);
                        } catch (e) { setSchema({ error: "Schema Syntax Error" }); }
                    } else { setSchema({ note: "No Schema definition found." }); }
                } else { setSchema({ error: `File missing (${res.status})` }); }
            } catch (error) { setSchema({ error: "Network Error" }); } finally { setLoading(false); }
        };
        fetchSchema();
    }, [widget.id]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6" onClick={onClose}>
            <motion.div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-5xl h-[600px] flex overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/10 text-white rounded-full z-50 backdrop-blur-md transition-all"><X size={20} /></button>
                <div className="w-2/5 border-r border-white/10 flex flex-col bg-[#0A0F1E]">
                    <div className="p-8 border-b border-white/10 bg-gradient-to-br from-indigo-900/20 to-transparent">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner"><Package className="w-8 h-8 text-indigo-400" /></div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Ready</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white leading-tight">{widget.name}</h2>
                        <p className="text-sm text-indigo-300 font-mono mt-2 uppercase tracking-wide opacity-70">{widget.type} Module</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Code size={12} /> Matrix</h3>
                            {loading ? <div className="space-y-2"><div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div></div> : schema && !schema.error && !schema.note ? (
                                <div className="space-y-3">
                                    {Object.entries(schema).map(([key, type]) => (
                                        <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-indigo-500/30 transition-colors">
                                            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:shadow-[0_0_8px_#6366f1]"></div><span className="text-sm font-bold text-gray-300 font-mono">{key}</span></div>
                                            <span className="text-[10px] text-gray-500 bg-black/30 px-2 py-1 rounded border border-white/5 font-mono">{typeof type === 'string' ? type.split(' ')[0] : 'SELECT'}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 text-xs">{schema?.error || "Standard Config"}</div>}
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-[#050505] relative flex flex-col items-center justify-center p-12">
                    <div className="absolute inset-0 pattern-grid-lg opacity-10 pointer-events-none"></div>
                    <div className="relative z-20 transition-all duration-500 hover:scale-105">
                        {WIDGET_REGISTRY[widget.id] ? React.createElement(WIDGET_REGISTRY[widget.id], { ...config }) : <div className="text-red-400">Not found</div>}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default WidgetProductModal;
