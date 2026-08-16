// Archivo: frontend/src/components/leads/BatchSearchInput.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, MapPin, Play, AlertTriangle, Cpu } from 'lucide-react';
import { CATEGORY_TAXONOMY } from '../../data/categories';
import { TUCUMAN_CITIES } from './BatchSearchData';

const BatchSearchInput = ({ form, onInputChange, onStart, error }) => {
    // Cálculo local para UI
    const effectiveQuery = form.query === '__custom__' ? form.customQuery : form.query;
    const canStart = effectiveQuery && effectiveQuery.length > 2;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="max-w-xl mx-auto space-y-6"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                    <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter italic">C.Y.B.O.R.G. Extraction</h3>
                <p className="text-gray-400 text-sm">Escaneando red neuronal de Google Maps para identificar activos <strong className="text-emerald-400">sin presencia digital</strong>.</p>
            </div>

            <div className="space-y-4">
                {/* Selector de Rubro */}
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 block mb-2">Vector de Búsqueda (Rubro)</label>
                    <select 
                        name="query"
                        value={form.query} 
                        onChange={onInputChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer font-mono text-sm"
                    >
                        <option value="" className="bg-zinc-900 text-gray-500">Seleccioná objetivo...</option>
                        {Object.entries(CATEGORY_TAXONOMY).map(([catId, cat]) => (
                            <optgroup key={catId} label={cat.label} className="bg-zinc-900">
                                {cat.subcategories.map(sub => (
                                    <option key={sub.id} value={sub.label} className="bg-zinc-900">{sub.label}</option>
                                ))}
                            </optgroup>
                        ))}
                        <option value="__custom__" className="bg-zinc-900 text-indigo-400">✏️ ENTRADA MANUAL...</option>
                    </select>
                </div>

                {/* Búsqueda Personalizada */}
                {form.query === '__custom__' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            name="customQuery"
                            value={form.customQuery} 
                            onChange={onInputChange} 
                            onKeyDown={(e) => e.key === 'Enter' && canStart && onStart()} 
                            placeholder="Ej: Vinotecas, Cerrajerías..." 
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-sm" 
                            autoFocus 
                        />
                    </motion.div>
                )}

                {/* Grid de Configuración */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 block mb-2">Geolocalización</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <select 
                                name="location"
                                value={form.location} 
                                onChange={onInputChange} 
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none appearance-none cursor-pointer font-mono text-sm"
                            >
                                {TUCUMAN_CITIES.map(city => (
                                    <option key={city} value={city} className="bg-zinc-900">{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 block mb-2">Amplitud (Leads)</label>
                        <select 
                            name="amount"
                            value={form.amount} 
                            onChange={onInputChange} 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none appearance-none cursor-pointer font-mono text-sm"
                        >
                            {[5, 10, 20, 50].map(v => (
                                <option key={v} value={v} className="bg-zinc-900">{v} OBJETIVOS</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono uppercase text-[10px]">
                        <AlertTriangle className="w-4 h-4 shrink-0" /> ERROR_SYSTEM: {error}
                    </div>
                )}

                <button 
                    onClick={onStart} 
                    disabled={!canStart} 
                    className={`w-full py-5 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all mt-4 border-2 tracking-[0.2em] uppercase ${
                        canStart 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                        : 'bg-white/5 text-gray-500 border-white/10 cursor-not-allowed'
                    }`}
                >
                    <Cpu className={`w-5 h-5 ${canStart ? 'animate-spin' : ''}`} /> 
                    INICIAR EXTRACCIÓN (C.Y.B.O.R.G.)
                </button>
            </div>
        </motion.div>
    );
};

export default BatchSearchInput;
