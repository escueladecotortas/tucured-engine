// Archivo: frontend/src/components/core/supercard/CardViewport.jsx
import React from 'react';
import { Globe, Trash2 } from 'lucide-react';
import StatusPill from './StatusPill';

const CardViewport = ({ client, viewMode, onDelete }) => {
    return (
        <div className={`
            relative overflow-hidden flex-shrink-0 bg-white
            ${viewMode === 'list' ? 'w-32 h-full border-r border-white/5' : 'h-[180px] w-full border-b border-white/5'}
        `}>
            {(client.siteUrl || client.deployUrl) ? (
                <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 z-20 bg-transparent" />
                    <iframe
                        src={client.siteUrl || client.deployUrl}
                        title={`Preview of ${client.name}`}
                        className="w-[400%] h-[400%] transform scale-25 origin-top-left border-none pointer-events-none select-none z-10"
                        loading="lazy"
                    />
                </div>
            ) : client.image ? (
                <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
            ) : (
                <div className={`w-full h-full bg-linear-to-br ${client.color || 'from-indigo-600 to-violet-600'} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <Globe className="w-16 h-16 text-white/30 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                </div>
            )}

            <div className="absolute top-3 right-3 z-30 flex gap-2">
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1 rounded-full bg-black/40 hover:bg-red-500/80 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10"
                        title="Delete Node"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
                <StatusPill status={client.status || (client.isGenerated ? 'generated' : 'pilot')} />
            </div>
        </div>
    );
};

export default CardViewport;
