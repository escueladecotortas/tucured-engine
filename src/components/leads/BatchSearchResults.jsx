// Archivo: frontend/src/components/leads/BatchSearchResults.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
    Download, Trash2, MapPin, Star, Phone, Globe, 
    Instagram, CheckCircle2, AlertCircle, Search, Filter 
} from 'lucide-react';

const BatchSearchResults = ({ results, onDownload, onClear, onReScrape }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex gap-4">
                <div className="text-sm">
                    <span className="text-white/40 block">Resultados</span>
                    <span className="text-white font-bold text-lg">{results.length}</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-sm">
                    <span className="text-white/40 block">Calidad Media</span>
                    <span className="text-indigo-400 font-bold text-lg">
                        {(results.reduce((acc, r) => acc + (r.score || 0), 0) / (results.length || 1)).toFixed(1)}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onClear} className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors" title="Limpiar todo">
                    <Trash2 size={20} />
                </button>
                <button onClick={onDownload} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20">
                    <Download size={18} />
                    Exportar JSON
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((lead, idx) => (
                <LeadCard key={idx} lead={lead} onReScrape={onReScrape} />
            ))}
        </div>
    </motion.div>
);

const LeadCard = ({ lead, onReScrape }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onReScrape(lead)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" title="Re-escanear">
                <Search size={16} />
            </button>
        </div>

        <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-white text-lg leading-tight line-clamp-1 pr-8">{lead.name}</h4>
            <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${lead.score > 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {lead.score}%
            </div>
        </div>

        <div className="space-y-2 text-sm text-white/60">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-indigo-400" /> <span className="line-clamp-1">{lead.address}</span></div>
            <div className="flex items-center gap-2"><Star size={14} className="text-yellow-400" /> <span>{lead.rating} ({lead.user_ratings_total} reviews)</span></div>
            {lead.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-emerald-400" /> <span>{lead.phone}</span></div>}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
            {lead.website && <a href={lead.website} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 transition-colors"><Globe size={16} /></a>}
            {lead.instagram && <a href={lead.instagram} target="_blank" rel="noreferrer" className="p-2 bg-pink-500/10 hover:bg-pink-500/20 rounded-xl text-pink-400 transition-colors"><Instagram size={16} /></a>}
            <div className="ml-auto flex gap-1">
                {lead.hasInstagram && <div className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-bold">IG FOUND</div>}
            </div>
        </div>
    </div>
);

export default BatchSearchResults;
